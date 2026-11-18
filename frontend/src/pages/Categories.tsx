import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'

import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { formatDate } from '../lib/format'
import { useAppStore, selectCategories, selectBooks, selectAddCategory, selectDeleteCategory } from '../state/store'

type CategoryForm = { name: string; description: string }

export default function Categories() {
  const categories = useAppStore(selectCategories)
  const books = useAppStore(selectBooks)

  const addCategory = useAppStore(selectAddCategory)
  const deleteCategory = useAppStore(selectDeleteCategory)

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState<CategoryForm>({ name: '', description: '' })

  const bookCountByCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const b of books) map.set(b.categoryId, (map.get(b.categoryId) ?? 0) + 1)
    return map
  }, [books])

  function submit() {
    if (!form.name.trim()) return
    addCategory({ name: form.name.trim(), description: form.description.trim() })
    setModalOpen(false)
  }

  function confirmDelete(id: string) {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  function doDelete() {
    if (!deleteId) return
    deleteCategory(deleteId)
    setDeleteOpen(false)
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="section-label">Organization</div>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Categories</h2>
          </div>

          <button
            onClick={() => { setForm({ name: '', description: '' }); setModalOpen(true) }}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition hover:brightness-105 active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#ffffff', boxShadow: '0 0 0 1px rgba(99,102,241,.25), 0 2px 12px rgba(139,92,246,.20)' }}
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>
      </motion.div>

      <div className="glass-panel-strong rounded-2xl p-4">
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-12 px-4 py-2.5 text-xs font-semibold table-header">
            <div className="col-span-3">Name</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-right">Books</div>
            <div className="col-span-1 text-right">Created</div>
            <div className="col-span-1 text-right">Del.</div>
          </div>

          <div>
            {categories.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-12 px-4 py-3.5 items-center text-sm transition hover:bg-[var(--surface-hover)]"
                style={{ borderTop: `1px solid var(--border)`, color: 'var(--text-primary)' }}
              >
                <div className="col-span-3 font-semibold">{c.name}</div>
                <div className="col-span-5" style={{ color: 'var(--text-secondary)' }}>{c.description}</div>
                <div className="col-span-2 text-right">
                  <span className="inline-flex items-center justify-center rounded-full bg-teal-50 border border-teal-200 text-teal-700 dark:bg-brandCyan/10 dark:border-brandCyan/25 dark:text-brandCyan px-2.5 py-0.5 text-xs font-semibold">
                    {bookCountByCategory.get(c.id) ?? 0}
                  </span>
                </div>
                <div className="col-span-1 text-right text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(c.createdAt)}</div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => confirmDelete(c.id)}
                    className="p-1.5 rounded-lg border transition hover:opacity-70"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-input)' }}
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 size={14} className="text-danger" />
                  </button>
                </div>
              </div>
            ))}

            {categories.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)', borderTop: `1px solid var(--border)` }}>
                No categories yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        open={modalOpen}
        title="Add Category"
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center rounded-xl px-5 py-2 bg-gradient-to-r from-brandTeal via-brandCyan to-brandIndigo text-sm font-bold text-slate-950 shadow-glow-teal focus-ring hover:brightness-110 active:scale-[0.99] transition"
              onClick={submit}
            >
              Add Category
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <label className="block">
            <div className="text-xs font-medium mb-1.5 text-slate-400">Description</div>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-brandCyan/50 focus:border-brandCyan/30 transition resize-none"
              rows={3}
            />
          </label>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteOpen}
        title="Delete Category"
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
        <div className="text-sm text-slate-400">This will remove the category. Books in this category will become uncategorized.</div>
      </Modal>
    </div>
  )
}
