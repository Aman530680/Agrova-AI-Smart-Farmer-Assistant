import { useState, useCallback, useRef } from 'react'

export function useSpeech() {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Map app language code to speech synthesis/recognition BCP 47 codes
  const getLanguageLocale = (langCode: string): string => {
    const locales: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      bn: 'bn-IN',
      pa: 'pa-IN',
      as: 'as-IN',
      or: 'or-IN',
      ur: 'ur-PK'
    }
    return locales[langCode] || 'en-US'
  }

  // Text-To-Speech (Speak response)
  const speak = useCallback((text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.')
      return
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel()

    // Strip markdown formatting symbols for clean narration
    const cleanText = text.replace(/[*#`_\-]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = getLanguageLocale(langCode)
    
    // Choose appropriate voice if available
    const voices = window.speechSynthesis.getVoices()
    const matchingVoice = voices.find(v => v.lang.startsWith(langCode))
    if (matchingVoice) {
      utterance.voice = matchingVoice
    }
    
    window.speechSynthesis.speak(utterance)
  }, [])

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Speech-To-Text (Voice Dictation Input)
  const startListening = useCallback((langCode: string, onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = getLanguageLocale(langCode)

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [])

  return {
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    isListening
  }
}
