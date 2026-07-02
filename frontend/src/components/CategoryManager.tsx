import { useEffect, useState } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, Category } from '../services/categoryService';
import { Pencil, Trash2, X, Check } from 'lucide-react';

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
  onCategoriesChanged: () => void;
}

export default function CategoryManager({ open, onClose, onCategoriesChanged }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');

  useEffect(() => {
    if (open) loadCategories();
  }, [open]);

  async function loadCategories() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setError('');
    try {
      await createCategory({ name: newName.trim(), icon: newIcon.trim() || undefined });
      setNewName('');
      setNewIcon('');
      onCategoriesChanged();
      await loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditIcon(cat.icon || '');
  }

  async function handleSaveEdit(id: string) {
    if (!editName.trim()) return;
    setError('');
    try {
      await updateCategory(id, { name: editName.trim(), icon: editIcon.trim() || undefined });
      setEditingId(null);
      onCategoriesChanged();
      await loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update category');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this category?')) return;
    setError('');
    try {
      await deleteCategory(id);
      onCategoriesChanged();
      await loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-charcoal">Manage Categories</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        <div className="mt-6 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="flex-1 rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-primary transition"
          />
          <input
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
            placeholder="Icon emoji"
            className="w-20 rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-primary transition text-center"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {loading ? (
            <p className="text-sm text-slate-500 animate-pulse">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-slate-500">No categories yet.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="flex items-center gap-2 rounded-xl border border-border bg-slate-50 px-4 py-3">
                {editingId === cat._id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition"
                    />
                    <input
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                      className="w-16 rounded-lg border border-border bg-white px-3 py-2 text-sm text-center outline-none focus:border-primary transition"
                    />
                    <button type="button" onClick={() => handleSaveEdit(cat._id)} className="rounded-full p-2 text-emerald-600 hover:bg-emerald-50 transition">
                      <Check size={16} />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-lg w-8 text-center">{cat.icon || '📁'}</span>
                    <span className="flex-1 text-sm font-medium text-charcoal">{cat.name}</span>
                    <button type="button" onClick={() => startEdit(cat)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-charcoal transition">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => handleDelete(cat._id)} className="rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition">
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
