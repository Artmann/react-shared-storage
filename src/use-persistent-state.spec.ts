import { renderHook, act } from '@testing-library/react'

import { usePersistentState } from './use-persistent-state'

class LocalStorageMock implements Storage {
  private readonly store: { [key: string]: string | null }

  length: number = 0;

  [key: string]: any

  constructor() {
    this.store = {}
  }

  key(index: number): string | null {
    throw new Error('Method not implemented.')
  }

  clear() {
    throw new Error('Method not implemented.')
  }

  getItem(key: string) {
    return this.store[key] || null
  }

  setItem(key: string, value: string | null) {
    this.store[key] = String(value)
  }

  removeItem(key: string) {
    delete this.store[key]
  }
}

describe('usePersistentState', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: new LocalStorageMock() })

    jest.useFakeTimers()
  })

  it('stores the state.', () => {
    const { result } = renderHook(() => usePersistentState('my-key', 'my-default-value'))

    const [ value, setValue ] = result.current

    expect(value).toEqual('my-default-value')

    act(() => {
      setValue('my-new-value')
    })

    const [ updatedValue ] = result.current

    expect(updatedValue).toEqual('my-new-value')
  })

  it('reads values from local storage.', () => {
    const { result } = renderHook(() => usePersistentState('message', '', {
      saveInterval: 1
    }))

    const [ , setValue ] = result.current

    act(() => {
      setValue('Hello World!')

      jest.runAllTimers()
    })

    const { result: otherResult } = renderHook(() => usePersistentState('message', ''))
    const [ otherValue ] = otherResult.current

    expect(otherValue).toEqual('Hello World!')
  })

  it('syncs the state between different hooks.', () => {
    const { result: hook1 } = renderHook(() => usePersistentState('synced-key', 'my-default-value'))
    const { result: hook2 } = renderHook(() => usePersistentState('synced-key', 'my-default-value'))

    const [ , setValue ] = hook1.current

    act(() => {
      setValue('This is a message from hook 1.')

      jest.runAllTimers()
    })

    const [ syncedValue ] = hook2.current

    expect(syncedValue).toEqual('This is a message from hook 1.')
  })
})
