import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Sprout } from 'lucide-react'
import { useAppDispatch } from '../store'
import { setCredentials } from '../store/slices/authSlice'
import { demoSession, login } from '../services/authService'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function Login() {
  const [email, setEmail] = useState('rajesh@agrova.ai')
  const [password, setPassword] = useState('demo1234')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const creds = await login(email, password)
      dispatch(setCredentials(creds))
      navigate('/dashboard')
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number }; code?: string })?.response?.status
      const code = (err as { code?: string })?.code
      if (code === 'ERR_NETWORK' || status === 401 || status === 404) {
        dispatch(setCredentials(demoSession()))
        navigate('/dashboard')
      } else {
        setError('Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07140d] p-4 text-white">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="text-center">
          <Sprout className="mx-auto mb-2 h-8 w-8 text-lime-300" />
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        </div>
        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        <label className="block text-sm">
          Email
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-200/50" />
            <Input className="pl-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </label>
        <label className="block text-sm">
          Password
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-200/50" />
            <Input className="pl-9" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </label>
        <Button className="w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
        <Button type="button" variant="secondary" className="w-full border-white/15 bg-transparent text-white" onClick={() => { dispatch(setCredentials(demoSession())); navigate('/dashboard') }}>
          Enter Demo
        </Button>
        <p className="text-center text-xs text-emerald-100/60">
          New here? <Link className="text-lime-300" to="/register">Create account</Link>
        </p>
      </form>
    </div>
  )
}
