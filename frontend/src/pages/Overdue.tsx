import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Mail, Download, RefreshCcw } from 'lucide-react'

import IssueReturnButtons from '../components/ui/IssueReturnButtons'
import { useAppStore, selectKpis, selectOverdueRows, selectRecalculateFines } from '../state/store'
import { formatDate, formatINR } from '../lib/format'

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
  return (
    <div
      className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
      style={{ backgroundColor: 'rgba(251,113,133,0.12)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.25)' }}
    >
      {initials}
    </div>
  )
}

function downloadCsv(rows: Record<string, string | number | null | undefined>[], filename: string) {
  const headers = Object.keys(rows[0] ?? { header: '' })
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function Overdue() {
  const kpis = useAppStore(selectKpis)
  const overdueRows = useAppStore(selectOverdueRows)
  const recalculateFines = useAppStore(selectRecalculateFines)

  const exportRows = useMemo(() => {
    return overdueRows.map((r) => ({
      patron: r.patron?.name ?? '',
      book: r.book?.title ?? '',
      issueDate: r.issueDate,
      dueDate: r.dueDate,
      daysOverdue: r.daysOverdue,
      fineAmount: r.fineAmount,
    }))
  }, [overdueRows])

  const actionBtnBase = 'inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:opacity-80 whitespace-nowrap'

  return (
    <div className="space-y-4">
      {/* Alert Banner — dual mode */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/25"
      >
        <div className="absolute -top-14 -right-20 h-48 w-48 rounded-full bg-rose-400/15 blur-3xl pointer-events-none" />
        <div className="relative p-5 sm:p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-100 border border-rose-300 dark:bg-rose-500/15 dark:border-rose-500/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="text-rose-600 dark:text-rose-300" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-300 mb-1">
                Overdue Fines
              </div>
              <div className="text-rose-900 dark:text-white font-bold text-lg">
                Total outstanding: {formatINR(kpis.totalFines)}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 flex-wrap">
            <div className="hidden sm:block">
              <IssueReturnButtons />
            </div>
            <button
              onClick={recalculateFines}
              className={[actionBtnBase, 'text-rose-700 border-rose-300 bg-rose-100 hover:bg-rose-200 dark:text-rose-300 dark:border-rose-500/30 dark:bg-rose-500/10 dark:hover:bg-rose-500/20'].join(' ')}
            >
              <RefreshCcw size={15} />
              <span className="hidden sm:inline">Recalculate Fines</span>
              <span className="sm:hidden">Recalc</span>
            </button>
            <button
              onClick={() => alert('Mock: reminders queued for overdue patrons.')}
              className={[actionBtnBase, 'text-rose-700 border-rose-300 bg-rose-100 hover:bg-rose-200 dark:text-rose-300 dark:border-rose-500/30 dark:bg-rose-500/10 dark:hover:bg-rose-500/20'].join(' ')}
            >
              <Mail size={15} />
              <span className="hidden sm:inline">Send Reminders</span>
              <span className="sm:hidden">Email</span>
            </button>
            <button
              onClick={() => downloadCsv(exportRows, 'pustak-tracker-overdue.csv')}
              className={[actionBtnBase, 'text-rose-700 border-rose-300 bg-rose-100 hover:bg-rose-200 dark:text-rose-300 dark:border-rose-500/30 dark:bg-rose-500/10 dark:hover:bg-rose-500/20'].join(' ')}
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>

          <div className="sm:hidden">
            <IssueReturnButtons />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <div className="glass-panel-strong rounded-2xl p-4">
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-14 px-4 py-2.5 text-xs font-semibold table-header items-center">
            <div className="col-span-2">Patron</div>
            <div className="col-span-4">Book Details</div>
            <div className="col-span-2">Issue</div>
            <div className="col-span-2">Due</div>
            <div className="col-span-1 text-right">Days</div>
            <div className="col-span-2 text-right">Fine</div>
            <div className="col-span-1 text-right">Email</div>
          </div>

          <div>
            {overdueRows.map((r) => (
              <div
                key={r.transactionId}
                className="grid grid-cols-14 px-4 py-3 items-center text-sm transition hover:bg-[var(--surface-hover)]"
                style={{ borderTop: `1px solid var(--border)`, color: 'var(--text-primary)' }}
              >
                <div className="col-span-2 flex items-center gap-2">
                  {r.patron ? <Avatar name={r.patron.name} /> : null}
                </div>

                <div className="col-span-4 min-w-0">
                  <div className="font-semibold truncate">{r.book?.title ?? '—'}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{r.patron?.name ?? '—'}</div>
                </div>

                <div className="col-span-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(r.issueDate)}</div>
                <div className="col-span-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(r.dueDate)}</div>

                <div className="col-span-1 text-right">
                  <span className="inline-flex items-center justify-center rounded-full bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/15 dark:border-rose-500/30 dark:text-rose-300 px-2 py-0.5 text-xs font-bold">
                    {r.daysOverdue}
                  </span>
                </div>

                <div className="col-span-2 text-right font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatINR(r.fineAmount)}
                </div>

                <div className="col-span-1 text-right">
                  <button
                    onClick={() => alert(`Mock: email reminder sent to ${r.patron?.email ?? 'patron'}.`)}
                    className="p-1.5 rounded-lg border transition hover:opacity-70"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-input)' }}
                    aria-label="Email reminder"
                  >
                    <Mail size={13} className="text-rose-500 dark:text-rose-300" />
                  </button>
                </div>
              </div>
            ))}

            {overdueRows.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)', borderTop: `1px solid var(--border)` }}>
                No overdue fines right now. 🎉
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
