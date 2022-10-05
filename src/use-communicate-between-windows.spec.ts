import { renderHook, act } from '@testing-library/react'

import { useCommunicateBetweenWindows } from './use-communicate-between-windows'

describe('useCommunicateBetweenWindows', () => {
  it('listens to messages from other senders', async () => {
    const { result: hook1 } = renderHook(() => useCommunicateBetweenWindows())
    const { result: hook2 } = renderHook(() => useCommunicateBetweenWindows())

    const hook1Listener = jest.fn()
    const hook2Listener = jest.fn()

    act(() => {
      hook1.current.subscribe('my-channel', hook1Listener)
      hook2.current.subscribe('my-channel', hook2Listener)

      hook1.current.broadcast('my-channel', 'Is anoyone there?')
    })

    await sleep()

    expect(hook2Listener).toHaveBeenCalledWith('Is anoyone there?')
    expect(hook1Listener).not.toHaveBeenCalled()
  })

  it('listens to messages on a channel', async () => {
    const { result: hook1 } = renderHook(() => useCommunicateBetweenWindows())
    const { result: hook2 } = renderHook(() => useCommunicateBetweenWindows())

    const hook1Listener = jest.fn()
    const hook2Listener = jest.fn()
    const hook3Listener = jest.fn()

    act(() => {
      hook1.current.subscribe('my-channel', hook1Listener)
      hook2.current.subscribe('my-channel', hook2Listener)
      hook2.current.subscribe('another-channel', hook3Listener)

      hook1.current.broadcast('my-channel', 'Is anoyone there?')
    })

    await sleep()

    expect(hook1Listener).not.toHaveBeenCalled()
    expect(hook2Listener).toHaveBeenCalledWith('Is anoyone there?')
    expect(hook3Listener).not.toHaveBeenCalled()
  })
})

function sleep(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 40)
  })
}
