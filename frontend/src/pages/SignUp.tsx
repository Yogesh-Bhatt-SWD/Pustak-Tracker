import { Eye, EyeOff, Mail, Lock, UserCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [reveal, setReveal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async () => {
    setError(null)

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const backend = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000'
      const res = await fetch(`${backend}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 border transition"
      style={{ backgroundColor: 'var(--surface-input)', borderColor: 'var(--border)' }}
    >
      {children}
    </div>
  )

  return (
    <div className="min-h-screen flex items-stretch">
      {/* ── Left panel — always dark decorative ───────────────────────────── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0b1220 0%, #071426 50%, rgba(99,102,241,0.20) 100%)' }} />
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(900px circle at 50% 50%, rgba(34,211,238,.22), transparent 55%), radial-gradient(800px circle at 80% 30%, rgba(99,102,241,.18), transparent 50%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-10">
          <img
            src="/src/assets/pustak_logo.png"
            alt="Pustak Tracker"
            className="h-28 w-28 rounded-3xl shadow-2xl shadow-teal-500/40 mb-8"
          />

          <h1 className="text-4xl font-display font-bold text-white mb-3">Pustak Tracker</h1>
          <p className="text-lg text-gradient font-semibold mb-12">Library Management System</p>

          <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
            {[
              { k: '1,200+', v: 'Books' },
              { k: '98%', v: 'Availability' },
              { k: '200+', v: 'Patrons' },
              { k: 'Live', v: 'Tracking' },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <div className="text-2xl font-bold text-white">{s.k}</div>
                <div className="text-sm text-slate-400 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — adaptive ───────────────────────────────────────── */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8"
        style={{ backgroundColor: 'var(--surface-base)' }}
      >
        <div className="w-full max-w-md">
          <div className="mb-7 text-center lg:text-left">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--brand-teal)' }}>
              Join the library
            </div>
            <div className="text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              Create Account
            </div>
          </div>

          <div
            className="rounded-3xl p-5 sm:p-6"
            style={{ backgroundColor: 'var(--surface-panel)', border: `1px solid var(--border)`, boxShadow: 'var(--glass-shadow)' }}
          >
            {success ? (
              <div className="rounded-xl border px-4 py-4 text-sm font-medium text-center" style={{ backgroundColor: 'rgba(20,184,166,0.10)', borderColor: 'rgba(20,184,166,0.30)', color: '#14b8a6' }}>
                ✓ Account created! Redirecting to login…
              </div>
            ) : (
              <div className="space-y-4">
                {/* Name */}
                <label className="block">
                  <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</div>
                  <FieldWrapper>
                    <UserCircle size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm"
                      style={{ color: 'var(--text-primary)' }}
                      placeholder="John Doe"
                    />
                  </FieldWrapper>
                </label>

                {/* Email */}
                <label className="block">
                  <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</div>
                  <FieldWrapper>
                    <Mail size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm"
                      style={{ color: 'var(--text-primary)' }}
                      placeholder="you@school.edu"
                    />
                  </FieldWrapper>
                </label>

                {/* Password */}
                <label className="block">
                  <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</div>
                  <FieldWrapper>
                    <Lock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={reveal ? 'text' : 'password'}
                      className="w-full bg-transparent outline-none text-sm"
                      style={{ color: 'var(--text-primary)' }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setReveal((v) => !v)}
                      className="transition hover:opacity-70"
                      style={{ color: 'var(--text-muted)' }}
                      aria-label={reveal ? 'Hide password' : 'Show password'}
                    >
                      {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </FieldWrapper>
                </label>

                {/* Confirm Password */}
                <label className="block">
                  <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Confirm Password</div>
                  <FieldWrapper>
                    <Lock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={reveal ? 'text' : 'password'}
                      className="w-full bg-transparent outline-none text-sm"
                      style={{ color: 'var(--text-primary)' }}
                      placeholder="••••••••"
                    />
                  </FieldWrapper>
                </label>

                {/* Submit */}
                <button
                  type="button"
                  className="w-full rounded-xl bg-gradient-to-r from-brandTeal via-brandCyan to-brandIndigo px-5 py-3 text-sm font-bold text-slate-950 shadow-glow-teal transition hover:brightness-110 active:scale-[0.99] focus-ring"
                  disabled={loading}
                  onClick={handleSignUp}
                >
                  {loading ? 'Creating Account…' : 'Create Account'}
                </button>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border px-3 py-2.5 text-xs font-medium" style={{ backgroundColor: 'rgba(251,113,133,0.10)', borderColor: 'rgba(251,113,133,0.30)', color: '#fb7185' }}>
                    {error}
                  </div>
                )}

                {/* Sign In link */}
                <div className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="font-semibold transition hover:underline"
                    style={{ color: 'var(--brand-cyan)' }}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-center lg:text-left" style={{ color: 'var(--text-muted)' }}>
            By creating an account, you accept library policy and usage guidelines.
          </div>
        </div>
      </div>
    </div>
  )
}
