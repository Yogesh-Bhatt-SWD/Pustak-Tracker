import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import IssueReturnButtons from '../components/ui/IssueReturnButtons'
import { useAppStore, selectBooks, selectCategories, selectAddBook, selectUpdateBook, selectDeleteBook } from '../state/store'

type BookForm = {
  title: string
  author: string
  publisher: string
  isbn: string
  barcodeId: string
  categoryId: string
  copies: string
}

export default function Books() {
  const books = useAppStore(selectBooks)
  const categories = useAppStore(selectCategories)

  const addBook = useAppStore(selectAddBook)
  const updateBook = useAppStore(selectUpdateBook)
  const deleteBook = useAppStore(selectDeleteBook)

  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState<BookForm>({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    barcodeId: '',
    categoryId: categories[0]?.id ?? '',
    copies: '1',
  })

  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])

  const filteredBooks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return books
    return books.filter((b) => {
      const cat = categoryById.get(b.categoryId)?.name ?? ''
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q)
      )
    })
  }, [books, query, categoryById])

  function openAdd() {
    setMode('add')
    setEditingId(null)
    setForm({ title: '', author: '', publisher: '', isbn: '', barcodeId: '', categoryId: categories[0]?.id ?? '', copies: '1' })
    setModalOpen(true)
  }

  function openEdit(id: string) {
    const book = books.find((b) => b.id === id)
    if (!book) return
    setMode('edit')
    setEditingId(id)
    setForm({ title: book.title, author: book.author, publisher: book.publisher, isbn: book.isbn, barcodeId: book.barcodeId, categoryId: book.categoryId, copies: String(book.totalCopies) })
    setModalOpen(true)
  }

  function submit() {
    const copies = Math.max(0, Number.parseInt(form.copies || '0', 10) || 0)
    if (!form.title.trim() || !form.author.trim() || !form.isbn.trim() || !form.categoryId) return

    if (mode === 'add') {
      addBook({ title: form.title.trim(), author: form.author.trim(), publisher: form.publisher.trim(), isbn: form.isbn.trim(), barcodeId: form.barcodeId.trim(), categoryId: form.categoryId, totalCopies: copies, availableCopies: copies })
    } else if (mode === 'edit' && editingId) {
      const existing = books.find((b) => b.id === editingId)
      const nextAvailable = existing ? Math.min(existing.availableCopies, copies) : copies
      updateBook(editingId, { title: form.title.trim(), author: form.author.trim(), publisher: form.publisher.trim(), isbn: form.isbn.trim(), barcodeId: form.barcodeId.trim(), categoryId: form.categoryId, totalCopies: copies, availableCopies: nextAvailable })
    }
    setModalOpen(false)
  }

  function confirmDelete(id: string) {
    setDeleteId(id)
    setDeleteOpen(true)
  }

  function doDelete() {
    if (!deleteId) return
    deleteBook(deleteId)
    setDeleteOpen(false)
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="section-label">Catalog</div>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Books</h2>
          </div>

          <div className="flex gap-3 flex-wrap justify-end">
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition hover:brightness-105 active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #22d3ee)', color: '#0f172a', boxShadow: '0 0 0 1px rgba(20,184,166,.25), 0 2px 12px rgba(34,211,238,.20)' }}
            >
              <Plus size={15} />
              Add Book
            </button>
            <IssueReturnButtons />
          </div>
        </div>
      </motion.div>

      <div className="glass-panel-strong rounded-2xl p-4">
        {/* Search bar */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border w-full max-w-md transition"
            style={{ backgroundColor: 'var(--surface-input)', borderColor: 'var(--border)' }}
          >
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
              placeholder="Search by title, author, ISBN…"
            />
          </div>
          <button
            className="hidden sm:inline-flex px-4 py-2 rounded-xl border text-sm font-medium transition hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-input)' }}
          >
            Export
          </button>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-12 gap-4 px-5 py-2.5 text-xs font-semibold table-header">
            <div className="col-span-3">Title</div>
            <div className="col-span-2">Author</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">ISBN</div>
            <div className="col-span-1 text-center">Total</div>
            <div className="col-span-1 text-center">Avail.</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div>
            {filteredBooks.map((r) => {
              const cat = categoryById.get(r.categoryId)
              const availableTone =
                r.availableCopies > 0
                  ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-brandTeal/15 dark:border-brandTeal/30 dark:text-brandCyan'
                  : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/15 dark:border-rose-500/30 dark:text-rose-300'

              return (
                <div
                  key={r.id}
                  className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center text-sm transition hover:bg-[var(--surface-hover)]"
                  style={{ borderTop: `1px solid var(--border)`, color: 'var(--text-primary)' }}
                >
                  <div className="col-span-3 font-semibold truncate">{r.title}</div>
                  <div className="col-span-2 truncate" style={{ color: 'var(--text-secondary)' }}>{r.author}</div>
                  <div className="col-span-2 truncate" style={{ color: 'var(--text-secondary)' }}>{cat?.name ?? '—'}</div>
                  <div className="col-span-2 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{r.isbn}</div>
                  <div className="col-span-1 text-center" style={{ color: 'var(--text-secondary)' }}>{r.totalCopies}</div>
                  <div className="col-span-1 flex justify-center">
                    <span className={['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs border font-semibold', availableTone].join(' ')}>
                      {r.availableCopies}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(r.id)}
                      className="p-1.5 rounded-lg border transition hover:opacity-70"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-input)' }}
                      aria-label={`Edit ${r.title}`}
                    >
                      <Pencil size={14} className="text-brandTeal" />
                    </button>
                    <button
                      onClick={() => confirmDelete(r.id)}
                      className="p-1.5 rounded-lg border transition hover:opacity-70"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-input)' }}
                      aria-label={`Delete ${r.title}`}
                    >
                      <Trash2 size={14} className="text-danger" />
                    </button>
                  </div>
                </div>
              )
            })}

            {filteredBooks.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-muted)', borderTop: `1px solid var(--border)` }}>
                No books match your search.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal — always dark */}
      <Modal
        open={modalOpen}
        title={mode === 'add' ? 'Add Book' : 'Edit Book'}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex items-center justify-between gap-3">
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
              {mode === 'add' ? 'Add Book' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <Input label="Author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
          <Input label="Publisher" value={form.publisher} onChange={(e) => setForm((f) => ({ ...f, publisher: e.target.value }))} />
          <Input label="ISBN" value={form.isbn} onChange={(e) => setForm((f) => ({ ...f, isbn: e.target.value }))} />
          <Input label="Barcode ID" value={form.barcodeId} onChange={(e) => setForm((f) => ({ ...f, barcodeId: e.target.value }))} />

          <label className="block">
            <div className="text-xs font-medium mb-1.5 text-slate-400">Category</div>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-brandCyan/50 focus:border-brandCyan/30 transition"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#071426] text-slate-100">
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <Input
            label="Copies count"
            type="number"
            min={0}
            value={form.copies}
            onChange={(e) => setForm((f) => ({ ...f, copies: e.target.value }))}
          />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteOpen}
        title="Delete Book"
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
        <div className="text-sm text-slate-400">
          This action will remove the book from the catalog. Existing transaction records will be preserved.
        </div>
      </Modal>
    </div>
  )
}
