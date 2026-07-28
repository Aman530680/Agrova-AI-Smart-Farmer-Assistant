import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, ArrowRight } from 'lucide-react'

const greetings = [
  { text: "Welcome", lang: "English" },
  { text: "स्वागत है", lang: "Hindi" },
  { text: "வரவேற்கிறோம்", lang: "Tamil" },
  { text: "స్వాగతం", lang: "Telugu" },
  { text: "ಸ್ವಾಗತ", lang: "Kannada" },
  { text: "സ്വാഗതം", lang: "Malayalam" },
  { text: "स्वागत आहे", lang: "Marathi" },
  { text: "સ્વાગત છે", lang: "Gujarati" },
  { text: "স্বাগতম", lang: "Bengali" },
  { text: "ਜੀ ਆਇਆਂ ਨੂੰ", lang: "Punjabi" },
  { text: "স্বাগতম", lang: "Assamese" },
  { text: "ସ୍ୱାଗତ", lang: "Odia" },
  { text: "خوش آمدید", lang: "Urdu" }
]

export default function Landing() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % greetings.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-neutral-950 to-black text-white">
      {/* Background decorative glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[120px]" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sprout className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Agrova AI Farmer Query
          </span>
        </div>
      </header>

      {/* Main Hero Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-2xl px-8 py-16 rounded-3xl glass glow-green flex flex-col items-center text-center space-y-10">
          
          {/* Animated Greeting Container */}
          <div className="h-28 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-col items-center"
              >
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-amber-200 to-emerald-300 bg-clip-text text-transparent">
                  {greetings[index].text}
                </h1>
                <p className="text-xs text-neutral-400 mt-2 uppercase tracking-widest font-semibold">
                  {greetings[index].lang}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-lg md:text-xl text-neutral-300 font-medium">
              Welcome to Agrova AI Farmer Query
            </h2>
            <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
              Empowering farmers with AI-driven disease diagnosis, real-time weather analytics, live market pricing, and smart government schemes.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/language')}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold rounded-2xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-300 transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-neutral-500 relative z-10 border-t border-white/5">
        © 2026 Agrova. Designed for Sustainable and Smart Agriculture.
      </footer>
    </div>
  )
}
