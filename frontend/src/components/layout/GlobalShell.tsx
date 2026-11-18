import type { PropsWithChildren } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, Activity, Tags, AlertTriangle, Search, Sun, Moon, Menu, X } from 'lucide-react'
import { useThemeStore, selectMode, selectToggle } from '../../state/themeStore'
import { useAuthStore, selectAccessToken, selectUser, selectLogout } from '../../state/authStore'
import { useMemo, useEffect, useState } from 'react'
import { useAppStore, selectKpis } from '../../state/store'

function Breadcrumbs() {
  const location = useLocation()
  const path = location.pathname

  const map: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/books': 'Books',
    '/users': 'Patrons',
    '/transactions': 'Transactions',
    '/categories': 'Categories',
    '/overdue': 'Overdue & Fines',
    '/scanner': 'Scanner',
  }

  const label = map[path] ?? 'Pustak Tracker'
  return (
    <div className="flex items-center gap-2 text-sm">
      <span style={{ color: 'var(--text-muted)' }}>Home</span>
      <span style={{ color: 'var(--border-strong)' }}>/</span>
      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
    </div>
  )
}

export default function GlobalShell({ children }: PropsWithChildren) {
  const mode = useThemeStore(selectMode)
  const toggle = useThemeStore(selectToggle)
  const location = useLocation()
  const navigate = useNavigate()

  const user = useAuthStore(selectUser)
  const logout = useAuthStore(selectLogout)
  const accessToken = useAuthStore(selectAccessToken)
  const kpis = useAppStore(selectKpis)

  const hydrateAll = useAppStore((s) => s.hydrateAll)
  const loaded = useAppStore((s) => s.loaded)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = useMemo(() => [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/books', label: 'Books', icon: BookOpen },
    { to: '/users', label: 'Patrons', icon: Users },
    { to: '/transactions', label: 'Transactions', icon: Activity },
    { to: '/categories', label: 'Categories', icon: Tags },
    { to: '/overdue', label: 'Overdue', icon: AlertTriangle, badge: kpis.overdueCount },
  ], [kpis.overdueCount])

  const initials = useMemo(() => {
    const parts = (user?.name ?? '').split(' ').filter(Boolean)
    const a = parts[0]?.[0] ?? 'P'
    const b = parts[1]?.[0] ?? 'T'
    return `${a}${b}`.toUpperCase()
  }, [user?.name])

  useEffect(() => {
    if (!accessToken) return
    if (loaded) return
    void hydrateAll()
  }, [accessToken, loaded, hydrateAll])

  const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="mt-6 flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = location.pathname === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={['group flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-150', active ? 'nav-item-active' : 'nav-item'].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div
                className="transition-colors duration-150"
                style={{ color: active ? 'var(--brand-teal)' : 'var(--text-muted)' }}
                aria-hidden="true"
              >
                <Icon size={18} />
              </div>
              <span
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: active ? 'var(--brand-teal)' : 'var(--text-secondary)' }}
              >
                {item.label}
              </span>
            </div>

            {typeof item.badge === 'number' && item.badge > 0 ? (
              <div className="ml-auto inline-flex items-center justify-center rounded-full bg-rose-100 text-rose-700 px-2 h-5 text-xs border border-rose-200 font-semibold dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30">
                {item.badge}
              </div>
            ) : null}
          </Link>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-base)', color: 'var(--text-primary)' }}>
      {/* ── Desktop Sidebar ─────────────────────────────────────────────────── */}
      <div className="hidden lg:block">
        <div
          className="fixed inset-y-0 left-0 w-64 border-r"
          style={{
            backgroundColor: 'var(--surface-sidebar)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="h-full flex flex-col px-4 py-5">
            {/* Logo */}
            <div className="flex items-center gap-3 px-1 py-1 mb-2">
              <img src="/src/assets/pustak_logo.png" alt="Pustak Tracker" className="h-9 w-9 rounded-xl shadow-md shadow-teal-500/30 flex-shrink-0" />
              <div>
                <div className="text-sm font-display font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Pustak Tracker
                </div>
                <div className="text-xs font-medium" style={{ color: 'var(--brand-teal)' }}>
                  Library Management
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px my-3" style={{ backgroundColor: 'var(--border)' }} />

            {/* Nav */}
            <SidebarNav />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Version tag */}
            <div className="px-1 py-2">
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Pustak Tracker v1.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content area ────────────────────────────────────────────────── */}
      <div className="lg:pl-64">
        {/* Header */}
        <header
          className="sticky top-0 z-30 border-b backdrop-blur-xl"
          style={{
            backgroundColor: mode === 'dark' ? 'rgba(7,20,38,0.85)' : 'rgba(255,255,255,0.90)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl border flex items-center justify-center transition hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-input)' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Breadcrumbs */}
            <div className="flex-1">
              <Breadcrumbs />
            </div>

            {/* Search + controls */}
            <div className="hidden md:flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3 py-2 w-64 rounded-xl border transition"
                style={{ backgroundColor: 'var(--surface-input)', borderColor: 'var(--border)' }}
              >
                <Search size={15} style={{ color: 'var(--text-muted)' }} />
                <input
                  className="bg-transparent outline-none text-sm w-full"
                  style={{ color: 'var(--text-primary)' }}
                  placeholder="Search books, patrons..."
                />
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                className="w-9 h-9 rounded-xl border flex items-center justify-center transition hover:opacity-70"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-input)' }}
                aria-label="Toggle theme"
              >
                {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            {/* Avatar */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAvatarOpen((v) => !v)}
                  className="relative h-9 w-9 rounded-xl border flex items-center justify-center text-sm font-bold transition hover:opacity-80"
                  style={{
                    borderColor: 'var(--brand-teal)',
                    color: 'var(--brand-teal)',
                    backgroundColor: 'rgba(20,184,166,0.08)',
                  }}
                  aria-label="User menu"
                >
                  {initials}
                </button>

                {avatarOpen ? (
                  <div
                    className="absolute right-0 top-11 w-68 rounded-2xl shadow-2xl overflow-hidden z-50"
                    style={{ backgroundColor: '#071426', border: '1px solid rgba(255,255,255,0.10)' }}
                    role="menu"
                  >
                    {/* User info */}
                    <div className="px-4 py-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brandTeal to-brandCyan flex items-center justify-center font-bold text-slate-950 text-sm">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-100 truncate">{user?.name ?? 'Librarian'}</div>
                          <div className="text-xs text-slate-400 truncate">{user?.email ?? ''}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarOpen(false)
                          logout()
                          navigate('/login')
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-rose-300 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden shadow-2xl"
              style={{ backgroundColor: 'var(--surface-sidebar)', borderRight: `1px solid var(--border)` }}
            >
              <div className="h-full flex flex-col px-4 py-5">
                {/* Header */}
                <div className="flex items-center justify-between px-1 py-1 mb-2">
                  <div className="flex items-center gap-3">
                    <img src="/src/assets/pustak_logo.png" alt="Pustak Tracker" className="h-9 w-9 rounded-xl shadow-md shadow-teal-500/30" />
                    <div>
                      <div className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Pustak Tracker</div>
                      <div className="text-xs font-medium" style={{ color: 'var(--brand-teal)' }}>Library Management</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg transition hover:opacity-70"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px my-3" style={{ backgroundColor: 'var(--border)' }} />

                {/* Nav */}
                <SidebarNav onNavigate={() => setMobileMenuOpen(false)} />

                {/* User Info at Bottom */}
                <div className="mt-auto pt-4" style={{ borderTop: `1px solid var(--border)` }}>
                  <div
                    className="rounded-2xl p-3"
                    style={{ backgroundColor: 'var(--surface-hover)', border: `1px solid var(--border)` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: 'rgba(20,184,166,0.12)', color: 'var(--brand-teal)', border: `1px solid rgba(20,184,166,0.25)` }}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name ?? 'Librarian'}</div>
                        <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.email ?? ''}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        logout()
                        navigate('/login')
                      }}
                      className="mt-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/15 border border-rose-200 dark:border-rose-500/25 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <main className="px-4 sm:px-6 py-6">{children}</main>
      </div>
    </div>
  )
}
