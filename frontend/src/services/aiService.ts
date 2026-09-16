import { getAuthToken } from '../lib/api'
import { mockKisanReply } from '../data/chat'

export async function streamChat(
  prompt: string,
  history: { role: string; content: string }[],
  onChunk: (text: string) => void,
) {
  const token = getAuthToken()
  try {
    const response = await fetch('/api/chatbot/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ prompt, history }),
    })

    if (!response.ok || !response.body) {
      throw new Error('Chat API unavailable')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let botText = ''
    let done = false
    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      botText += decoder.decode(value || new Uint8Array())
      onChunk(botText)
    }
    if (!botText.trim()) throw new Error('Empty stream')
    return { fallback: false }
  } catch {
    const mock = mockKisanReply(prompt)
    const extras = [
      mock.text,
      '',
      'Possible Causes',
      ...mock.causes.map((c) => `• ${c}`),
      '',
      'Recommended Actions',
      ...mock.actions.map((c) => `• ${c}`),
      '',
      'Prevention Tips',
      ...mock.prevention.map((c) => `• ${c}`),
    ].join('\n')
    onChunk(extras)
    return { fallback: true }
  }
}
