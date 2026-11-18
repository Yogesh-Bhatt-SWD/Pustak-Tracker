import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, UserRound, ShieldCheck, Ban, Search, UserPlus } from 'lucide-react'

import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import IssueReturnButtons from '../components/ui/IssueReturnButtons'
import { formatDate } from '../lib/format'
import { useAppStore, selectPatrons, selectAddPatron, selectSetPatronStatus, selectDeletePatron } from '../state/store'

function InitialAvatar({ name }: { name: string }) {
  const parts = name.split(' ').filter(Boolean)
  const initials = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
  return (
    <div
      className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
      style={{ backgroundColor: 'rgba(20,184,166,0.10)', color: 'var(--brand-teal)', border: '1px solid rgba(20,184,166,0.20)' }}
    >
      {initials.toUpperCase()}
    </div>
  )
}

type PatronForm = { name: string; email: string; password: string; role: 'Librarian' | 'Patron' }

export default function Users() {
  const patrons = useAppStore(selectPatrons)
  const addPatron = useAppStore(selectAddPatron)
  const setPatronStatus = useAppStore(selectSetPatronStatus)
  const deletePatron = useAppStore(selectDeletePatron)

  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patrons
    return patrons.filter((p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
  }, [patrons, query])

  const [addOpen, setAddOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState<PatronForm>({ name: '', email: '', password: '', role: 'Patron' })

  function openAdd() {
    setForm({ name: '', email: '', password: '', role: 'Patron' })
    setAddOpen(true)
  }

  function submitAdd() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return
    addPatron({ name: form.name.trim(), email: form.email.trim(), password: form.password.trim(), role: form.role })
    setAddOpen(false)
  }

  function confirmDelete(id: string) {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  function doDelete() {
    if (!deleteId) return
    deletePatron(deleteId)
    setDeleteOpen(false)
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="section-label">People</div>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Patrons / Users</h2>
          </div>

          <div className="flex gap-3 flex-wrap justify-end">
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition hover:brightness-105 active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff', boxShadow: '0 0 0 1px rgba(99,102,241,.25), 0 2px 12px rgba(139,92,246,.20)' }}
            >
              <UserPlus size={15} />
              Add Patron
            </button>
            <IssueReturnButtons />
          </div>
        </div>
      </motion.div>

      <div className="glass-panel-strong rounded-2xl p-4">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border w-full max-w-md"
          style={{ backgroundColor: 'var(--surface-input)', borderColor: 'var(--border)' }}
        >
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
            placeholder="Search by name or email…"
          />
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-12 px-4 py-2.5 text-xs font-semibold table-header">
            <div className="col-span-3">Name</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Joined</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div>
            {filtered.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-12 px-4 py-3 items-center text-sm transition hover:bg-[var(--surface-hover)]"
                style={{ borderTop: `1px solid var(--border)`, color: 'var(--text-primary)' }}
              >
                <div className="col-span-3 flex items-center gap-2.5">
                  <InitialAvatar name={r.name} />
                  <div className="font-semibold truncate">{r.name}</div>
                </div>
                <div className="col-span-4 truncate" style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{r.email}</div>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-brandIndigo/10 dark:border-brandIndigo/25 dark:text-brandIndigo px-2.5 py-0.5 text-xs font-semibold">
                    <ShieldCheck size={12} />
                    {r.role}
                  </span>
                </div>
                <div className="col-span-1">
                  <span
                    className={[
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs border font-semibold',
                      r.status === 'Active'
                        ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-brandTeal/15 dark:border-brandTeal/30 dark:text-brandCyan'
                        : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/15 dark:border-rose-500/30 dark:text-rose-300',
                    ].join(' ')}
                  >
                    {r.status === 'Active' ? <UserRound size={11} /> : <Ban size={11} />}
                    {r.status}
                  </span>
                </div>
                <div className="col-span-1 text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(r.joinedAt)}</div>
                <div className="col-span-1 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => setPatronStatus(r.id, r.status === 'Active' ? 'Suspended' : 'Active')}
                    className="p-1.5 rounded-lg border transition hover:opacity-70"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-input)' }}
                    aria-label="Toggle suspend"
                    title={r.status === 'Active' ? 'Suspend' : 'Activate'}
                  >
                    {r.status === 'Active'
                      ? <Ban size={14} className="text-danger" />
                      : <UserRound size={14} className="text-brandTeal" />}
                  </button>
                  <button
                    onClick={() => confirmDelete(r.id)}
                    className="p-1.5 rounded-lg border transition hover:opacity-70"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-input)' }}
                    aria-label="Delete user"
                  >
                    <Trash2 size={14} className="text-danger" />
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)', borderTop: `1px solid var(--border)` }}>
                No patrons found.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Add Patron Modal */}
      <Modal
        open={addOpen}
        title="Add Patron"
        onClose={() => setAddOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center rounded-xl px-5 py-2 bg-gradient-to-r from-brandTeal via-brandCyan to-brandIndigo text-sm font-bold text-slate-950 shadow-glow-teal focus-ring hover:brightness-110 active:scale-[0.99] transition"
              onClick={submitAdd}
            >
              Add Patron
            </button>
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />

          <label className="block sm:col-span-2">
            <div className="text-xs font-medium mb-1.5 text-slate-400">Role</div>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as PatronForm['role'] }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-brandCyan/50 focus:border-brandCyan/30 transition"
            >
              <option value="Librarian" className="bg-[#071426]">Librarian</option>
              <option value="Patron" className="bg-[#071426]">Patron</option>
            </select>
          </label>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteOpen}
        title="Delete Patron"
        onClose={() => setDeleteOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center rounded-xl px-5 py-2 bg-rose-500/15 border border-rose-500/30 text-sm font-bold text-rose-300 hover:bg-rose-500/25 transition focus-ring"
              onClick={doDelete}
            >
              Confirm Delete
            </button>
          </div>
        }
      >
        <div className="text-sm text-slate-400">This will remove the patron from the system. All transaction history will be preserved.</div>
      </Modal>
    </div>
  )
}
