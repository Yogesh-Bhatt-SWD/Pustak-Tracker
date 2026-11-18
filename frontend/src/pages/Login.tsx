import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, selectLogin, selectLoading, selectError } from '../state/authStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore(selectLogin)
  const loading = useAuthStore(selectLoading)
  const error = useAuthStore(selectError)

  const [email, setEmail] = useState('librarian@pustak.com')
  const [password, setPassword] = useState('admin123')
  const [reveal, setReveal] = useState(false)

  const demoText = useMemo(
    () => ({ label: 'Demo credentials', value: 'librarian@pustak.com / admin123' }),
    [],
  )

  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768
  }, [])

  return (
    <div className="min-h-screen flex items-stretch">
      {/* ── Left panel — always dark decorative panel ────────────────────── */}
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

      {/* ── Right panel — adapts to theme ────────────────────────────────── */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8"
        style={{ backgroundColor: 'var(--surface-base)' }}
      >
        <div className="w-full max-w-md">
          <div className="mb-7 text-center lg:text-left">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--brand-teal)' }}>
              Welcome back
            </div>
            <div className="text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
              Sign in
            </div>
            {isMobile && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border" style={{ backgroundColor: 'rgba(34,211,238,0.10)', borderColor: 'rgba(34,211,238,0.30)', color: 'var(--brand-cyan)' }}>
                <span className="h-2 w-2 rounded-full bg-brandCyan animate-pulse" />
                Mobile Scanner Mode
              </div>
            )}
          </div>

          <div
            className="rounded-3xl p-5 sm:p-6"
            style={{ backgroundColor: 'var(--surface-panel)', border: `1px solid var(--border)`, boxShadow: 'var(--glass-shadow)' }}
          >
            <div className="space-y-4">
              {/* Email */}
              <label className="block">
                <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</div>
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 border transition" style={{ backgroundColor: 'var(--surface-input)', borderColor: 'var(--border)' }}>
                  <Mail size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                    style={{ color: 'var(--text-primary)' }}
                    placeholder="you@school.edu"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block">
                <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</div>
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 border transition" style={{ backgroundColor: 'var(--surface-input)', borderColor: 'var(--border)' }}>
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
                </div>
              </label>

              {/* Sign In button */}
              <button
                type="button"
                className="w-full rounded-xl bg-gradient-to-r from-brandTeal via-brandCyan to-brandIndigo px-5 py-3 text-sm font-bold text-slate-950 shadow-glow-teal transition hover:brightness-110 active:scale-[0.99] focus-ring"
                disabled={loading}
                onClick={async () => {
                  try {
                    await login({ email, password })
                    await new Promise(resolve => setTimeout(resolve, 100))
                    navigate(isMobile ? '/scanner' : '/dashboard')
                  } catch {
                    // Error shown below
                  }
                }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              {/* Error */}
              {error ? (
                <div className="rounded-xl border px-3 py-2.5 text-xs font-medium" style={{ backgroundColor: 'rgba(251,113,133,0.10)', borderColor: 'rgba(251,113,133,0.30)', color: '#fb7185' }}>
                  {error}
                </div>
              ) : null}

              {/* Demo credentials */}
              <div className="rounded-xl px-3 py-3 border" style={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border)' }}>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{demoText.label}</div>
                <div className="text-xs font-semibold font-mono" style={{ color: 'var(--text-secondary)' }}>{demoText.value}</div>
              </div>

              {/* Sign Up link */}
              <div className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="font-semibold transition hover:underline"
                  style={{ color: 'var(--brand-cyan)' }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-center lg:text-left" style={{ color: 'var(--text-muted)' }}>
            By continuing, you accept library policy and usage guidelines.
          </div>
        </div>
      </div>
    </div>
  )
}
