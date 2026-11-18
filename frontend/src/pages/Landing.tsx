import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Users, TrendingUp, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore, selectBooks, selectPatrons, selectKpis } from '../state/store'
import { useAuthStore } from '../state/authStore'

export default function Landing() {
  const navigate = useNavigate()
  const books = useAppStore(selectBooks)
  const patrons = useAppStore(selectPatrons)
  const kpis = useAppStore(selectKpis)
  const hydrateAll = useAppStore((state) => state.hydrateAll)
  const accessToken = useAuthStore((state) => state.accessToken)

  // Load data when Landing mounts and user is authenticated
  useEffect(() => {
    if (accessToken) {
      hydrateAll().catch(() => {
        // Silent fail - data just won't show on landing page
      })
    }
  }, [accessToken, hydrateAll])

  // Calculate real statistics
  const totalBooks = books.length
  const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0)
  const availableCopies = books.reduce((sum, book) => sum + book.availableCopies, 0)
  const availabilityRate = totalCopies > 0 ? Math.round((availableCopies / totalCopies) * 100) : 0
  const totalPatrons = patrons.length
  const activePatrons = kpis.activePatrons

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0b1220' }}>
      {/* Background gradients */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(800px circle at 50% 30%, rgba(34,211,238,.22), transparent 50%), radial-gradient(700px circle at 80% 60%, rgba(99,102,241,.18), transparent 45%), radial-gradient(600px circle at 20% 80%, rgba(20,184,166,.16), transparent 45%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center"
        >
          {/* Logo and Title */}
          <div className="text-center mb-12">
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src="/src/assets/pustak_logo.png" 
              alt="Pustak Tracker" 
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl shadow-2xl shadow-teal-500/40 mb-6 mx-auto" 
            />

            <h1 className="text-4xl sm:text-6xl font-display font-bold text-white mb-3">
              Pustak Tracker
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-2">
              Professional Library Management System
            </p>
            
            <p className="text-sm sm:text-base text-slate-500">
              Streamline your library operations with powerful tools
            </p>
          </div>

          {/* Authentication Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-16 w-full max-w-md"
          >
            <button
              onClick={() => navigate('/login')}
              className="group flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brandTeal via-brandCyan to-brandIndigo px-8 py-4 text-base font-bold text-slate-950 shadow-glow-teal transition hover:brightness-110 hover:scale-105 active:scale-[0.99] focus-ring"
            >
              Sign In
              <ArrowRight className="group-hover:translate-x-1 transition" size={18} />
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="flex-1 inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-xl transition hover:bg-white/15 hover:scale-105 active:scale-[0.99] focus-ring"
            >
              Sign Up
            </button>
          </motion.div>

          {/* Real Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-4xl mb-12"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, color: 'brandCyan', value: totalBooks, label: 'Books in Catalog' },
                { icon: TrendingUp, color: 'brandIndigo', value: `${availabilityRate}%`, label: 'Availability Rate' },
                { icon: Users, color: 'brandTeal', value: totalPatrons, label: 'Total Patrons' },
                { icon: Shield, color: 'purple-300', value: activePatrons, label: 'Active Users' },
              ].map(({ icon: Icon, color, value, label }) => (
                <div
                  key={label}
                  className="p-6 rounded-2xl hover:scale-105 transition-all duration-300"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className={`h-12 w-12 rounded-xl bg-${color}/20 border border-${color}/30 flex items-center justify-center`}>
                      <Icon className={`text-${color}`} size={24} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white text-center">{value}</div>
                  <div className="text-sm text-slate-400 mt-1 text-center">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-4xl"
          >
            <div
              className="rounded-3xl p-8"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h2 className="text-2xl font-display font-bold text-white text-center mb-6">Why Choose Pustak Tracker?</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: BookOpen, color: 'brandCyan', title: 'Smart Cataloging', desc: 'Organize and manage your entire book collection efficiently' },
                  { icon: Users, color: 'brandTeal', title: 'User Management', desc: 'Track patrons, memberships, and borrowing history' },
                  { icon: TrendingUp, color: 'brandIndigo', title: 'Real-time Analytics', desc: 'Monitor circulation, trends, and library performance' },
                  { icon: Shield, color: 'purple-300', title: 'Secure Access', desc: 'Role-based permissions and data protection' },
                  { icon: BookOpen, color: 'brandCyan', title: 'Barcode Scanning', desc: 'Quick issue and return with mobile scanner' },
                  { icon: TrendingUp, color: 'brandTeal', title: 'Fine Management', desc: 'Automated fine calculation and tracking' },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="text-center">
                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-${color}/20 border border-${color}/30 mb-3`}>
                      <Icon className={`text-${color}`} size={20} />
                    </div>
                    <h3 className="text-white font-semibold mb-1.5">{title}</h3>
                    <p className="text-sm text-slate-400">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 text-center text-sm text-slate-600"
          >
            <p>© 2024 Pustak Tracker · Professional Library Management</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
