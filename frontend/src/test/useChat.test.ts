import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useChat } from '../hooks/useChat'

function makeStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk))
      }
      controller.close()
    },
  })
}

describe('useChat', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initialises with empty state', () => {
    const { result } = renderHook(() => useChat())
    expect(result.current.messages).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sends user message and streams response', async () => {
    const sseChunks = [
      'data: {"text":"Hello"}\n\n',
      'data: {"text":" world"}\n\n',
      'data: [DONE]\n\n',
    ]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: makeStream(sseChunks),
    } as unknown as Response)

    const { result } = renderHook(() => useChat())

    await act(async () => {
      await result.current.sendMessage('Hi')
    })

    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[0]).toEqual({ role: 'user', content: 'Hi' })
    expect(result.current.messages[1]).toEqual({ role: 'assistant', content: 'Hello world' })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets error and removes assistant message on 429', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 429,
    } as unknown as Response)

    const { result } = renderHook(() => useChat())

    await act(async () => {
      await result.current.sendMessage('Hi')
    })

    // only user message remains (assistant placeholder removed)
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].role).toBe('user')
    expect(result.current.error).toMatch(/rate limit/i)
  })

  it('sets generic error on non-429 failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as unknown as Response)

    const { result } = renderHook(() => useChat())

    await act(async () => {
      await result.current.sendMessage('Hi')
    })

    expect(result.current.error).toMatch(/failed to connect/i)
  })

  it('sets error on network failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useChat())

    await act(async () => {
      await result.current.sendMessage('Hi')
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.messages).toHaveLength(1)
  })

  it('clearMessages resets state', async () => {
    const sseChunks = ['data: {"text":"Hi"}\n\n', 'data: [DONE]\n\n']
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: makeStream(sseChunks),
    } as unknown as Response)

    const { result } = renderHook(() => useChat())

    await act(async () => {
      await result.current.sendMessage('test')
    })

    act(() => {
      result.current.clearMessages()
    })

    expect(result.current.messages).toEqual([])
    expect(result.current.error).toBeNull()
  })
})
