import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Boxes, UsersRound } from 'lucide-react'
import type { ComponentType } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import IssueReturnButtons from '../components/ui/IssueReturnButtons'
import { formatINR } from '../lib/format'
import {
  selectDueSoon,
  selectKpis,
  selectMonthlyCirculationTrend,
  selectRecentTransactions,
  selectTopCategoriesChart,
  useAppStore,
} from '../state/store'

function KpiCard({
  icon: Icon,
  label,
  value,
  accentColor,
  glowClass,
  badgeText,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  value: string
  accentColor: string
  glowClass: string
  badgeText?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel-strong rounded-2xl p-4 relative overflow-hidden"
    >
      <div className={`absolute inset-0 pointer-events-none ${glowClass} opacity-40`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
            <Icon className="opacity-70" size={15} style={{ color: accentColor }} />
            {label}
          </div>
          <div className="text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
        </div>
        {badgeText ? (
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-rose-500 rounded-full shadow-[0_0_0_4px_rgba(251,113,133,0.18)]" />
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 dark:bg-rose-500/15 dark:border-rose-500/30 px-2.5 py-1 text-xs text-rose-600 dark:text-rose-300 font-semibold animate-[subtlePulse_2.2s_ease-in-out_infinite]">
              {badgeText}
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const kpis = useAppStore(selectKpis)
  const dueSoon = useAppStore(selectDueSoon)
  const recentTx = useAppStore(selectRecentTransactions)
  const monthlyTrend = useAppStore(selectMonthlyCirculationTrend)
  const topCategories = useAppStore(selectTopCategoriesChart)

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="section-label">Operations Overview</div>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h2>
          </div>
          <IssueReturnButtons />
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={Boxes}
          label="Books Checked Out"
          value={String(kpis.booksCheckedOut)}
          accentColor="#22d3ee"
          glowClass="shadow-glow-teal"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Overdue"
          value={String(kpis.overdueCount)}
          accentColor="#fb7185"
          glowClass="shadow-glow-indigo"
          badgeText={formatINR(kpis.totalFines)}
        />
        <KpiCard
          icon={UsersRound}
          label="Active Patrons"
          value={String(kpis.activePatrons)}
          accentColor="#14b8a6"
          glowClass="shadow-glow-teal"
        />
        <KpiCard
          icon={TrendingUp}
          label="Inventory %"
          value={`${kpis.inventoryPct}%`}
          accentColor="#6366f1"
          glowClass="shadow-glow-indigo"
        />
      </div>

      {/* Charts */}
      <div className="grid xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 glass-panel-strong rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <div className="section-label">Monthly Circulation</div>
              <div className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Line trend</div>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Last 12 months</div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid stroke="var(--chart-grid)" />
                <XAxis dataKey="name" stroke="var(--chart-axis)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--chart-axis)" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--chart-tooltip-bg)',
                    border: '1px solid var(--chart-tooltip-border)',
                    borderRadius: '0.75rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#22d3ee', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-2 glass-panel-strong rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-label">Top Categories</div>
              <div className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Bar chart</div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCategories}>
                <CartesianGrid stroke="var(--chart-grid)" />
                <XAxis dataKey="name" stroke="var(--chart-axis)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--chart-axis)" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--chart-tooltip-bg)',
                    border: '1px solid var(--chart-tooltip-border)',
                    borderRadius: '0.75rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Due Soon + Recent Transactions */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 glass-panel-strong rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-label">Due Soon</div>
              <div className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Priority list</div>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Next 3 days</div>
          </div>

          <div className="space-y-2.5">
            {dueSoon.map((d, idx) => (
              <motion.div
                key={d.transactionId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="rounded-xl p-3 flex items-center justify-between gap-3"
                style={{ backgroundColor: 'var(--surface-hover)', border: `1px solid var(--border)` }}
              >
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{d.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{d.patronName}</div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 dark:bg-brandCyan/10 dark:border-brandCyan/25 px-2.5 py-1 text-xs text-teal-700 dark:text-brandCyan font-semibold whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-brandCyan" />
                  {d.daysLeft}d left
                </div>
              </motion.div>
            ))}
            {dueSoon.length === 0 && (
              <div className="py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No items due soon.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 glass-panel-strong rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-label">Recent Transactions</div>
              <div className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Live activity</div>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Last 3 records</div>
          </div>

          <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
            <div className="grid grid-cols-12 px-4 py-2.5 text-xs font-semibold table-header">
              <div className="col-span-3">When</div>
              <div className="col-span-3">Action</div>
              <div className="col-span-3">Book</div>
              <div className="col-span-3">Patron</div>
            </div>
            <div style={{ borderTop: `1px solid var(--border)` }}>
              {recentTx.map((t, idx) => (
                <motion.div
                  key={t.what}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="grid grid-cols-12 px-4 py-3 text-sm"
                  style={{ color: 'var(--text-primary)', borderBottom: `1px solid var(--border)` }}
                >
                  <div className="col-span-3" style={{ color: 'var(--text-secondary)' }}>{t.when}</div>
                  <div className="col-span-3">
                    <span
                      className={[
                        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                        t.action === 'Overdue'
                          ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/15 dark:border-rose-500/30 dark:text-rose-300'
                          : t.action === 'Returned'
                            ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-brandCyan/10 dark:border-brandCyan/25 dark:text-brandCyan'
                            : 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-brandIndigo/10 dark:border-brandIndigo/25 dark:text-brandIndigo',
                      ].join(' ')}
                    >
                      {t.action}
                    </span>
                  </div>
                  <div className="col-span-3 font-semibold truncate">{t.what}</div>
                  <div className="col-span-3 truncate" style={{ color: 'var(--text-secondary)' }}>{t.who}</div>
                </motion.div>
              ))}
              {recentTx.length === 0 && (
                <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No recent activity.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
