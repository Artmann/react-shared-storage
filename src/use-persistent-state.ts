import debounce from 'lodash/debounce'
import { useState, useEffect } from 'react'

import { Listener, useCommunicateBetweenWindows } from './use-communicate-between-windows'

type InitialValueFunction<T> = () => T

type SetterFunction<T> = (newValue: T) => void

type UsePersistentStateOptions = {
  saveInterval?: number
  shouldSync?: boolean
}

export function usePersistentState<T>(
  key: string,
  initialValue: T | InitialValueFunction<T>,
  options: UsePersistentStateOptions = {}
): [ T, SetterFunction<T> ] {
  const shouldSync = options.shouldSync ?? true
  const saveInterval = options.saveInterval ?? 200

  const getInitialValue = (): T => {
    const savedValue = load<T>(key)

    if (savedValue) {
      return savedValue
    }

    if (isInitialValueFunction(initialValue)) {
      return initialValue()
    }

    return initialValue
  }

  const [ value, setValue ] = useState<T>(getInitialValue)
  const { broadcast, subscribe, unsubscribe } = useCommunicateBetweenWindows()

  useEffect(() => {
    const listener: Listener = (payload) => {
      if (payload.key !== key) {
        return
      }

      setValue(payload.value)
    }

    subscribe('state-updated', listener)

    return () => unsubscribe('state-updated', listener)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ key ])

  const debouncedSave = debounce(save, saveInterval)

  const updateValue: SetterFunction<T> = (newValue) => {
    setValue(newValue)

    debouncedSave(key, newValue)

    if (shouldSync) {
      broadcast('state-updated', {
        key,
        value: newValue
      })
    }
  }

  return [ value, updateValue ]
}

function load<T>(key: string): T | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  const json = localStorage.getItem(key)

  if (!json) {
    return undefined
  }

  return JSON.parse(json) as T
}

function save<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return
  }

  const json = JSON.stringify(value)

  localStorage.setItem(key, json)
}

function isInitialValueFunction<T>(maybeFunction: T | InitialValueFunction<T>): maybeFunction is InitialValueFunction<T> {
  return typeof maybeFunction === 'function'
}
