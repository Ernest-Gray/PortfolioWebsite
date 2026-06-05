import { useCallback, useState } from 'react'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (userMessage: string) => {
      const apiUrl = import.meta.env['VITE_API_URL'] ?? 'http://localhost:8000'
      setError(null)
      const userMsg: Message = { role: 'user', content: userMessage }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      const assistantMsg: Message = { role: 'assistant', content: '' }
      setMessages((prev) => [...prev, assistantMsg])

      try {
        const response = await fetch(`${apiUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            history: messages
              .slice(-10)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
        })

        if (!response.ok) {
          throw new Error(
            response.status === 429
              ? 'Rate limit reached. Try again in a minute.'
              : 'Failed to connect to API.',
          )
        }

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const { text } = JSON.parse(data) as { text: string }
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + text,
                }
                return updated
              })
            } catch {
              // ignore malformed SSE lines
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
        setMessages((prev) => prev.slice(0, -1))
      } finally {
        setIsLoading(false)
      }
    },
    [messages],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, clearMessages }
}
