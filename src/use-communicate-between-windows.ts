import { useEffect, useState } from 'react'
import { v4 as createUuid } from 'uuid'

type BroadcastFunction = (channel: string, payload: any) => void

type BroadcastMessage = {
  channel: string
  payload: any
  senderId: string
}

type ChannelName = string

type Listener = (payload: any) => void
type ListenerSubscription = (channelName: string, listener: Listener) => void

type WindowCommunication = {
  broadcast: BroadcastFunction,
  subscribe: ListenerSubscription
}

let broadcastChannel: BroadcastChannel | undefined


export function useCommunicateBetweenWindows(): WindowCommunication {
  const id = createUuid()
  const [ listeners, setListeners ] = useState<Record<ChannelName, Listener[]>>({})

  useEffect(() => {
    broadcastChannel = new BroadcastChannel('react-shared-storage')
    
    broadcastChannel.onmessage = event => {
      if (event.origin !== window.location.origin) {
        return
      }

      const message: BroadcastMessage = event.data
      
      if (!isMessage(message)) {
        return
      }

      if (message.senderId === id) {
        return
      }
     
      listeners[message.channel]?.forEach(listener => listener(message.payload))
    }

    return () => broadcastChannel?.close()
  }, [ listeners ])

  const broadcast: BroadcastFunction = (channel, payload)=> {
    const message: BroadcastMessage = {
      channel,
      payload,
      senderId: id
    }
    
    broadcastChannel?.postMessage(message)
  }

  const subscribe: ListenerSubscription = (channelName, listener): void => {
    setListeners(listeners => ({
      ...listeners,
      [channelName]: [
        ...(listeners[channelName] ?? []),
        listener
      ]
    }))
  }

  return {
    broadcast,
    subscribe
  }
}

function isMessage(maybeMessage: any): maybeMessage is BroadcastMessage {
  if (!maybeMessage) {
    return false
  }

  return maybeMessage.channel && maybeMessage.payload && maybeMessage.senderId
}