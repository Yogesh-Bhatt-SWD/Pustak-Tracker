import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Shield } from 'lucide-react'

import IssueReturnButtons from '../components/ui/IssueReturnButtons'
import { formatDate, formatINR } from '../lib/format'
import { useAppStore, selectPatrons, selectBooks, selectTransactions } from '../state/store'

type SegId = 'all' | 'issued' | 'returned' | 'overdue'
type TxStatus = 'Issued' | 'Returned' | 'Overdue'

const tabs: { id: SegId; label: string; status?: TxStatus }[] = [
  { id: 'all', label: 'All' },
  { id: 'issued', label: 'Issued', status: 'Issued' },
  { id: 'returned', label: 'Returned', status: 'Returned' },
  { id: 'overdue', label: 'Overdue', status: 'Overdue' },
]

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
      style={{ backgroundColor: 'rgba(99,102,241,0.10)', color: '#8b5cf6', border: '1px solid rgba(99,102,241,0.20)' }}
    >
      {initials}
    </div>
  )
}

export default function Transactions() {
  const patrons = useAppStore(selectPatrons)
  const books = useAppStore(selectBooks)
  const transactions = useAppStore(selectTransactions)

  const [tab, setTab] = useState<SegId>('all')

  const patronsById = useMemo(() => new Map(patrons.map((p) => [p.id, p])), [patrons])
  const booksById = useMemo(() => new Map(books.map((b) => [b.id, b])), [books])

  const filtered = useMemo(() => {
    const t = tabs.find((x) => x.id === tab)
    if (!t?.status) return transactions
    return transactions.filter((x) => x.status === t.status)
  }, [tab, transactions])

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="section-label">Library Activity</div>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Transactions</h2>
          </div>
          <IssueReturnButtons />
        </div>
      </motion.div>

      <div className="glass-panel-strong rounded-2xl p-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((t) => {
            const active = t.id === tab
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-4 py-1.5 rounded-xl border text-sm font-semibold transition"
                style={
                  active
                    ? { backgroundColor: 'rgba(20,184,166,0.12)', borderColor: 'rgba(20,184,166,0.30)', color: 'var(--brand-teal)' }
                    : { backgroundColor: 'var(--surface-input)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }
                }
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-12 px-4 py-2.5 text-xs font-semibold table-header">
            <div className="col-span-3">Patron</div>
            <div className="col-span-3">Book</div>
            <div className="col-span-3">Dates</div>
            <div className="col-span-1 text-right">Fine</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          <div>
            {filtered.map((t) => {
              const patron = patronsById.get(t.patronId)
              const book = booksById.get(t.bookId)

              const badgeClass =
                t.status === 'Overdue'
                  ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/15 dark:border-rose-500/30 dark:text-rose-300'
                  : t.status === 'Returned'
                    ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-brandCyan/10 dark:border-brandCyan/25 dark:text-brandCyan'
                    : 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-brandIndigo/10 dark:border-brandIndigo/25 dark:text-brandIndigo'

              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-12 px-4 py-3 items-center text-sm transition hover:bg-[var(--surface-hover)]"
                  style={{ borderTop: `1px solid var(--border)`, color: 'var(--text-primary)' }}
                >
                  <div className="col-span-3 flex items-center gap-2.5">
                    {patron ? <Avatar name={patron.name} /> : null}
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{patron?.name ?? '—'}</div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{patron?.email ?? ''}</div>
                    </div>
                  </div>

                  <div className="col-span-3 min-w-0">
                    <div className="font-semibold truncate">{book?.title ?? '—'}</div>
                    <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{book?.author ?? ''}</div>
                  </div>

                  <div className="col-span-3" style={{ color: 'var(--text-secondary)' }}>
                    <div className="text-xs flex items-center gap-1.5">
                      <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                      {formatDate(t.issueDate)} → <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatDate(t.dueDate)}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Return: {t.returnDate ? formatDate(t.returnDate) : '—'}
                    </div>
                  </div>

                  <div className="col-span-1 text-right text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {formatINR(t.fineAmount)}
                  </div>

                  <div className="col-span-2 text-right">
                    <span className={['inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', badgeClass].join(' ')}>
                      <Shield size={11} />
                      {t.status}
                    </span>
                  </div>
                </motion.div>
              )
            })}

            {filtered.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)', borderTop: `1px solid var(--border)` }}>
                No transactions in this filter.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
