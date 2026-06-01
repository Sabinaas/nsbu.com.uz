import { useState, useRef, useEffect } from 'react'
import { t } from '../i18n/index.js'
import { findRelevantStandards } from '../data/standards.js'

export default function AIChat({ lang }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: t(lang, 'aiGreeting') }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const examples = t(lang, 'exampleQuestions')

  async function send(text) {
    const question = text || input.trim()
    if (!question || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setLoading(true)
    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, lang, context: findRelevantStandards(question) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'error')
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: t(lang, 'errorGeneral') }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-slate-400">
              {t(lang, 'thinking')}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Example questions */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 pb-3">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => send(ex)}
              className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-2 border-t border-slate-200 bg-slate-50">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={t(lang, 'aiInputPlaceholder')}
          disabled={loading}
          className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          {t(lang, 'send')}
        </button>
      </div>
    </div>
  )
}
