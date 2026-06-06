import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useChat } from '../hooks/useChat'

const SUGGESTED = [
  'What did you build at AWS?',
  'Tell me about your ML work at Northrop',
  "What's your experience with RAG?",
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, isLoading, error, sendMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || isLoading) return
    setInput('')
    await sendMessage(msg)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <>
      {/* Toggle button */}
      <button
        data-testid="chat-toggle"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-sm rounded-full shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
      >
        <span className="text-base">{open ? '✕' : '✦'}</span>
        {!open && <span>Ask about Ernest</span>}
      </button>

      {/* Desktop floating panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-40 w-[380px] h-[540px] hidden md:flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              error={error}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              handleKey={handleKey}
              sendMessage={sendMessage}
              bottomRef={bottomRef}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col bg-slate-950"
          >
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              error={error}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              handleKey={handleKey}
              sendMessage={sendMessage}
              bottomRef={bottomRef}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface ChatPanelProps {
  messages: ReturnType<typeof useChat>['messages']
  isLoading: boolean
  error: string | null
  input: string
  setInput: (v: string) => void
  handleSend: () => void
  handleKey: (e: React.KeyboardEvent) => void
  sendMessage: (msg: string) => Promise<void>
  bottomRef: React.RefObject<HTMLDivElement | null>
}

function ChatPanel({
  messages,
  isLoading,
  error,
  input,
  setInput,
  handleSend,
  handleKey,
  sendMessage,
  bottomRef,
}: ChatPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <p className="text-slate-100 font-medium text-sm">Ask about Ernest</p>
        <p className="text-slate-500 text-xs">Answers grounded in real work history</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-slate-500 text-xs text-center mb-4">Try asking:</p>
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => void sendMessage(s)}
                className="w-full text-left px-3 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-slate-200 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-500 text-slate-950 rounded-br-sm'
                  : 'bg-slate-800 text-slate-200 rounded-bl-sm'
              }`}
            >
              {msg.content ||
                (isLoading && i === messages.length - 1 ? (
                  <span className="animate-pulse">▋</span>
                ) : (
                  ''
                ))}
            </div>
          </div>
        ))}
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 p-3 border-t border-slate-800 bg-slate-900">
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          />
          <button
            onClick={() => void handleSend()}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold text-base"
          >
            {isLoading ? '…' : '↑'}
          </button>
        </div>
      </div>
    </div>
  )
}
