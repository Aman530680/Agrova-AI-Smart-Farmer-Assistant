import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../store'
import { useSpeech } from '../../hooks/useSpeech'
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  User, 
  Bot, 
  Sparkles,
  RefreshCw,
  CornerDownLeft
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'model'
  content: string
}

export default function ChatbotModule() {
  const { t } = useTranslation()
  const currentLanguage = useAppSelector((state) => state.settings.language)
  const token = useAppSelector((state) => state.auth.token)

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: t('modules.chatbot.welcome_msg', 'Hello! I am your Kisan Mitra AI assistant. Ask me anything about crop cultivation, soil health, fertilizer management, or pest controls.')
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const { speak, stopSpeaking, startListening, stopListening, isListening } = useSpeech()

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Mic dictation result
  const handleMicInput = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening(currentLanguage, (transcript) => {
        setInput((prev) => prev + (prev ? ' ' : '') + transcript)
      })
    }
  }

  // TTS Readout toggle
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (activeSpeechId === msgId) {
      stopSpeaking()
      setActiveSpeechId(null)
    } else {
      speak(text, currentLanguage)
      setActiveSpeechId(msgId)
    }
  }

  const handleSend = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault()
    const queryText = promptOverride || input
    if (!queryText.trim() || isLoading) return

    const userMessageId = `user-${Date.now()}`
    const botMessageId = `bot-${Date.now()}`

    const newMessages: Message[] = [
      ...messages,
      { id: userMessageId, role: 'user', content: queryText }
    ]

    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    // Setup placeholder message for bot
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, role: 'model', content: '' }
    ])

    try {
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: queryText,
          history: newMessages.slice(1).map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!response.ok) {
        throw new Error('Connection failed')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let done = false
        let botText = ''

        while (!done) {
          const { value, done: doneReading } = await reader.read()
          done = doneReading
          const chunkValue = decoder.decode(value)
          botText += chunkValue

          setMessages((prev) => 
            prev.map(m => m.id === botMessageId ? { ...m, content: botText } : m)
          )
        }
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => 
        prev.map(m => m.id === botMessageId ? { ...m, content: 'Sorry, I encountered an error. Please verify your connection and key configs.' } : m)
      )
    } finally {
      setIsLoading(false)
    }
  }

  const quickPrompts = [
    t('modules.chatbot.prompt_1', 'What are the best fertilizer inputs for rice crops?'),
    t('modules.chatbot.prompt_2', 'How can I prevent tomato leaf spot disease organically?'),
    t('modules.chatbot.prompt_3', 'Give me a sowing guide for wheat crop.')
  ]

  const handleClearHistory = () => {
    stopSpeaking()
    setActiveSpeechId(null)
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: t('modules.chatbot.welcome_msg', 'Hello! I am your Kisan Mitra AI assistant. Ask me anything about crop cultivation, soil health, fertilizer management, or pest controls.')
      }
    ])
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col justify-between max-w-5xl mx-auto glass glow-green rounded-3xl overflow-hidden relative border border-white/5">
      
      {/* Module Header */}
      <div className="px-6 py-4 bg-neutral-900/60 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bot className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              Kisan Mitra AI <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h1>
            <p className="text-[10px] text-emerald-400 font-semibold tracking-wide uppercase">Gemini 2.0 Flash Active</p>
          </div>
        </div>

        <button 
          onClick={handleClearHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 bg-neutral-800/40 text-xs text-neutral-400 hover:text-white hover:border-emerald-500/30 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/5">
        
        {/* Predefined chips if history is empty */}
        {messages.length === 1 && (
          <div className="space-y-3 max-w-lg mx-auto py-8">
            <h3 className="text-xs text-neutral-400 font-bold uppercase tracking-wider text-center">Suggested Queries</h3>
            <div className="flex flex-col gap-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(undefined, p)}
                  className="p-4 rounded-2xl bg-neutral-900/40 border border-white/5 text-left text-sm text-neutral-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isBot = msg.role === 'model'
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center flex-shrink-0 border ${
                isBot 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1">
                <div className={`p-4 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap ${
                  isBot
                    ? 'bg-neutral-900/30 border-white/5 text-neutral-200 rounded-tl-none'
                    : 'bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border-emerald-500/30 text-white rounded-tr-none'
                }`}>
                  {msg.content || (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                    </span>
                  )}
                </div>

                {/* Bubble toolbar actions (TTS read aloud) */}
                {isBot && msg.content && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleSpeak(msg.id, msg.content)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
                        activeSpeechId === msg.id
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 glow-gold'
                          : 'bg-neutral-900/40 text-neutral-500 border-transparent hover:text-neutral-300'
                      }`}
                    >
                      {activeSpeechId === msg.id ? (
                        <>
                          <VolumeX className="w-3 h-3" />
                          <span>Stop Listening</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>Listen Aloud</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input panel */}
      <form onSubmit={handleSend} className="p-4 bg-neutral-900/60 border-t border-white/5 space-y-2 z-10">
        <div className="relative flex items-center">
          
          {/* Input text field */}
          <input
            type="text"
            required
            disabled={isLoading}
            placeholder={t('modules.chatbot.placeholder', 'Ask a question...')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-neutral-950/60 border border-white/5 focus:border-emerald-500/40 rounded-2xl py-4 pl-4 pr-24 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all duration-300"
          />

          {/* Buttons toolbar */}
          <div className="absolute right-3 flex items-center gap-1.5">
            {/* Mic input trigger */}
            <button
              type="button"
              onClick={handleMicInput}
              className={`p-2 rounded-xl border transition-all ${
                isListening
                  ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                  : 'bg-neutral-800/40 border-transparent text-neutral-400 hover:text-white hover:border-white/10'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send trigger */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black hover:shadow-lg hover:shadow-emerald-500/10 disabled:opacity-50 disabled:shadow-none transition-all duration-300"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Info hints */}
        <div className="flex justify-between items-center px-2">
          <p className="text-[10px] text-neutral-500 flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> Press Enter to send query
          </p>
          <p className="text-[10px] text-neutral-500">
            Powered by Gemini flash
          </p>
        </div>
      </form>

    </div>
  )
}
