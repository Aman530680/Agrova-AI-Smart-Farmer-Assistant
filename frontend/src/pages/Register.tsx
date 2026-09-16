import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { useAppDispatch } from '../store'
import { setCredentials } from '../store/slices/authSlice'
import { demoSession, register } from '../services/authService'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'

export default function Register() {
  const [name, setName] = useState('Rajesh Kumar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [language, setLanguage] = useState('en')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const creds = await register({ name, email, password, primary_language: language })
      dispatch(setCredentials(creds))
      navigate('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'ERR_NETWORK') {
        dispatch(setCredentials(demoSession()))
        navigate('/dashboard')
      } else {
        setError('Registration failed. Try demo mode.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07140d] p-4 text-white">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8">
        <Sprout className="mx-auto h-8 w-8 text-lime-300" />
        <h1 className="text-center font-display text-2xl font-bold">Create account</h1>
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="ta">தமிழ்</option>
          <option value="ml">മലയാളം</option>
          <option value="te">తెలుగు</option>
          <option value="fr">Français</option>
        </Select>
        <Button className="w-full" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</Button>
        <p className="text-center text-xs text-emerald-100/60">
          Already registered? <Link className="text-lime-300" to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
