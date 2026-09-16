import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bot, Copy, Mic, Paperclip, Search, Send, User } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useSpeech } from '../../hooks/useSpeech'
import { useAppSelector } from '../../store'
import { streamChat } from '../../services/aiService'
import { suggestedPrompts } from '../../data/chat'
import { useToast } from '../../components/ui/Toast'
import type { ChatMessage } from '../../types'
import { loadProfile } from '../../lib/profile'

export default function ChatbotModule() {
  const { t } = useTranslation()
  const language = useAppSelector((s) => s.settings.language)
  const profile = loadProfile()
  const { startListening, stopListening, isListening } = useSpeech()
  const { toast } = useToast()
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: t('modules.chatbot.welcome', `Hello ${profile.name.split(' ')[0]} — I am Kisan Mitra. Ask about fertilizer, yellow leaves, rain, prices, or irrigation.`),
      createdAt: new Date().toISOString(),
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text?: string) => {
    const prompt = (text || input).trim()
    if (!prompt || loading) return
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: prompt, createdAt: new Date().toISOString() }
    const botId = `b-${Date.now()}`
    const history = [...messages, userMsg]
    setMessages([...history, { id: botId, role: 'model', content: '', createdAt: new Date().toISOString() }])
    setInput('')
    setLoading(true)
    setError('')
    try {
      await streamChat(
        prompt,
        history.filter((m) => m.id !== 'welcome').map((m) => ({ role: m.role, content: m.content })),
        (chunk) => setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, content: chunk } : m))),
      )
    } catch {
      setError(t('common.loadError', "We couldn't get an answer. Please try again."))
      setMessages((prev) => prev.filter((message) => message.id !== botId))
    } finally {
      setLoading(false)
    }
  }

  const visible = messages.filter((m) => !search || m.content.toLowerCase().includes(search.toLowerCase()))

  return (
    <PageContainer title={t('modules.chatbot.title', 'Kisan Mitra')} subtitle={t('modules.chatbot.desc', 'Your friendly farming companion')}>
      <div className="grid gap-4 xl:grid-cols-[1.6fr_0.8fr]">
        <div className="flex h-[calc(100vh-16rem)] min-h-[480px] flex-col overflow-hidden rounded-3xl border border-[#e8efe3] bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#edf3ea] bg-[#fafcf9] p-3">
            <Search className="ml-2 h-4 w-4 text-[#7a887c]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('modules.chatbot.search', 'Search conversation')}
              className="border-0 bg-transparent shadow-none"
              aria-label={t('modules.chatbot.search', 'Search conversation')}
            />
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 1 && (
              <div className="grid gap-2 md:grid-cols-2">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-2xl border border-[#e8efe3] bg-[#f7faf4] p-3 text-left text-sm text-[#27372f] hover:border-[#9ad1a6] hover:bg-[#edf9f0]"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {visible.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${msg.role === 'model' ? 'bg-[#eaf8ee] text-[#166534]' : 'bg-[#fff5db] text-[#b76d00]'}`}>
                  {msg.role === 'model' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={`max-w-[82%] rounded-2xl border px-4 py-3 ${msg.role === 'model' ? 'border-[#edf3ea] bg-[#f7faf4]' : 'border-[#cfead8] bg-[#edf9f0]'}`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#1d3528]">
                    {msg.content || (
                      <span className="inline-flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#166534]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#166534] [animation-delay:120ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#166534] [animation-delay:240ms]" />
                      </span>
                    )}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-[#66736a]">
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.role === 'model' && msg.content && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.content)
                          toast(t('modules.chatbot.copied', 'Response copied'))
                        }}
                        className="inline-flex items-center gap-1 hover:text-[#17201a]"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            className="border-t border-[#edf3ea] bg-[#fafcf9] p-3"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <div className="flex items-center gap-2 rounded-2xl border border-[#dfe8dc] bg-white px-2 py-1.5 shadow-sm">
              <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf" onChange={() => toast(t('modules.chatbot.attachmentReady', 'Attachment ready — describe it in your message'), 'info')} />
              <button type="button" aria-label={t('modules.chatbot.attach', 'Attach file')} className="rounded-lg p-2 hover:bg-[#f4f7f0]" onClick={() => fileRef.current?.click()}>
                <Paperclip className="h-4 w-4 text-[#2e4137]" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('modules.chatbot.ask', 'Ask Kisan Mitra…')}
                className="flex-1 bg-transparent py-2 text-sm text-[#1d3528] outline-none placeholder:text-[#7a887c]"
                aria-label={t('modules.chatbot.ask', 'Chat message')}
              />
              <button
                type="button"
                aria-label={t('modules.chatbot.voiceInput', 'Voice input')}
                className={`rounded-lg p-2 ${isListening ? 'bg-[#fee2e2] text-[#b91c1c]' : 'hover:bg-[#f4f7f0] text-[#2e4137]'}`}
                onClick={() => (isListening ? stopListening() : startListening(language, (t) => setInput((p) => `${p} ${t}`.trim())))}
              >
                <Mic className="h-4 w-4" />
              </button>
              <Button type="submit" size="sm" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
          {error && <p className="border-t border-[#f0d4ce] bg-[#fff7f4] px-4 py-2 text-sm text-[#a34c3d]">{error}</p>}
        </div>

        <aside className="rounded-3xl border border-[#e8efe3] bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a887c]">{t('modules.chatbot.farmContext', 'Farm context')}</p>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-[#f5f8f2] p-3">
              <p className="text-xs text-[#66736a]">{t('modules.chatbot.activeCrop', 'Active crop')}</p>
              <p className="mt-1 text-xl font-bold text-[#17201a]">Tomato</p>
              <p className="text-sm text-[#53665a]">Day 42 of 90</p>
            </div>
            <div className="rounded-2xl border border-[#e8efe3] p-3">
              <p className="text-xs text-[#66736a]">{t('modules.chatbot.cropHealth', 'Crop health')}</p>
              <p className="mt-1 text-2xl font-bold text-[#166534]">87%</p>
              <p className="text-sm text-[#53665a]">Healthy fruit set</p>
            </div>
            <div className="rounded-2xl border border-[#e8efe3] p-3">
              <p className="text-xs text-[#66736a]">{t('modules.chatbot.farmNotes', 'Farm notes')}</p>
              <ul className="mt-2 space-y-2 text-sm text-[#415549]">
                <li>• Irrigation scheduled before 8 AM</li>
                <li>• Mettupalayam tomato price is strong</li>
                <li>• Rain likely tomorrow evening</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </PageContainer>
  )
}
