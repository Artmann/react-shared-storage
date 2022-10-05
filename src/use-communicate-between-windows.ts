import { BroadcastChannel } from 'broadcast-channel'
import { useCallback, useEffect, useState } from 'react'
import { v4 as createUuid } from 'uuid'

export type BroadcastFunction = (channel: string, payload: any) => void

export type BroadcastMessage = {
  channel: string
  payload: any
  senderId: string
}

export type ChannelName = string

export type Listener = (payload: any) => void

type ListenerSubscription = (channelName: string, listener: Listener) => void

type WindowCommunication = {
  broadcast: BroadcastFunction,
  subscribe: ListenerSubscription,
  unsubscribe: ListenerSubscription
}

let broadcastChannel: BroadcastChannel | undefined

export function useCommunicateBetweenWindows(): WindowCommunication {
  const [ id ] = useState(() => createUuid())
  const [ listeners, setListeners ] = useState<Record<ChannelName, Listener[]>>({})

  useEffect(() => {
    const channelOptions: any = {
      webWorkerSupport: false
    }

    if (process.env.NODE_ENV?.toLowerCase() === 'test') {
      channelOptions.type = 'simulate'
    }

    broadcastChannel = new BroadcastChannel<BroadcastMessage>('react-shared-storage', channelOptions)

    broadcastChannel.onmessage = (message) => {
      if (!isMessage(message)) {
        return
      }

      if (message.senderId === id) {
        return
      }

      listeners[message.channel]?.forEach((listener) => listener(message.payload))
    }

    return () => {
      broadcastChannel?.close()
    }
  }, [ id, listeners ])

  const broadcast: BroadcastFunction = useCallback((channel, payload) => {
    const message: BroadcastMessage = {
      channel,
      payload,
      senderId: id
    }

    broadcastChannel?.postMessage(message)
  }, [ id ])

  const subscribe: ListenerSubscription = (channelName, listener): void => {
    setListeners((existingListeners) => ({
      ...existingListeners,
      [channelName]: [
        ...(listeners[channelName] ?? []),
        listener
      ]
    }))
  }

  const unsubscribe: ListenerSubscription = (channelName, listener): void => {
    setListeners((existingListeners) => ({
      ...existingListeners,
      [channelName]: (listeners[channelName] ?? []).filter((l) => l !== listener)
    }))
  }

  return {
    broadcast,
    subscribe,
    unsubscribe
  }
}

function isMessage(maybeMessage: any): maybeMessage is BroadcastMessage {
  if (!maybeMessage) {
    return false
  }

  return maybeMessage.channel && maybeMessage.payload && maybeMessage.senderId
}
