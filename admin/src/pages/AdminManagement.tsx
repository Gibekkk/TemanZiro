import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase_config';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router';
import { ShieldPlus, Pencil, ShieldOff, X } from 'lucide-react';

type AdminLevel = 0 | 1 | 2 | 3;

const LEVEL_LABEL: Record<number, string> = {
  1: 'Admin Operasional',
  2: 'Admin Verifikasi',
  3: 'Owner',
};

function toAdminLevel(val: any): AdminLevel {
  const n = typeof val === 'number' ? val : parseInt(val, 10);
  if (n === 1 || n === 2 || n === 3) return n;
  return 0;
}

// ─── Edit level modal ───────────────────────────────────────────────────────
function EditLevelModal({
  companion, onClose, onSave, saving,
}: {
  companion: any;
  onClose: () => void;
  onSave: (level: 1 | 2) => void;
  saving: boolean;
}) {
  const [level, setLevel] = useState<1 | 2>(companion.admin_level === 2 ? 2 : 1);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-2xl p-6 w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg">Edit Admin Role</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {companion.name_companion ?? companion.name ?? 'Companion'}
        </p>
        <div className="space-y-2">
          {[1, 2].map((lvl) => (
            <label
              key={lvl}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer text-sm transition-colors ${
                level === lvl
                  ? 'border-primary-500 bg-primary-500/10 text-slate-900 dark:text-white'
                  : 'border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400'
              }`}
            >
              <input
                type="radio"
                name="admin_level"
                className="accent-primary-500"
                checked={level === lvl}
                onChange={() => setLevel(lvl as 1 | 2)}
              />
              {LEVEL_LABEL[lvl]}
            </label>
          ))}
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(level)}
            disabled={saving}
            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete (downgrade to level 0) confirm modal ───────────────────────────
function DeleteConfirmModal({
  companion, onClose, onConfirm, saving,
}: {
  companion: any;
  onClose: () => void;
  onConfirm: () => void;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-2xl p-6 w-full max-w-sm space-y-4">
        <h3 className="text-slate-900 dark:text-white font-bold text-lg">Hapus Admin</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Turunkan hak admin{' '}
          <span className="font-semibold text-slate-800 dark:text-white">
            {companion.name_companion ?? companion.name ?? 'companion ini'}
          </span>{' '}
          ke level 0? Companion tetap terdaftar, hanya kehilangan akses admin panel.
        </p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Memproses...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add admin modal (pick a non-admin companion + level) ──────────────────
function AddAdminModal({
  candidates, onClose, onAdd, saving,
}: {
  candidates: any[];
  onClose: () => void;
  onAdd: (companionId: string, level: 1 | 2) => void;
  saving: boolean;
}) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [level, setLevel] = useState<1 | 2>(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) =>
      (c.name_companion ?? c.name ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q)
    );
  }, [candidates, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg">Tambah Admin</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau email companion..."
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500"
        />

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-6">
              Tidak ada companion yang cocok.
            </p>
          ) : (
            filtered.map((c) => (
              <label
                key={c.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer text-sm transition-colors ${
                  selectedId === c.id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-gray-200 dark:border-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="candidate"
                  className="accent-primary-500"
                  checked={selectedId === c.id}
                  onChange={() => setSelectedId(c.id)}
                />
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">
                    {c.name_companion ?? c.name ?? '—'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{c.email ?? '-'}</p>
                </div>
              </label>
            ))
          )}
        </div>

        {selectedId && (
          <div className="space-y-2 pt-1 border-t border-gray-200 dark:border-white/10">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide pt-2">
              Angkat sebagai
            </p>
            {[1, 2].map((lvl) => (
              <label
                key={lvl}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer text-sm transition-colors ${
                  level === lvl
                    ? 'border-primary-500 bg-primary-500/10 text-slate-900 dark:text-white'
                    : 'border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="new_admin_level"
                  className="accent-primary-500"
                  checked={level === lvl}
                  onChange={() => setLevel(lvl as 1 | 2)}
                />
                {LEVEL_LABEL[lvl]}
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => selectedId && onAdd(selectedId, level)}
            disabled={!selectedId || saving}
            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Angkat Jadi Admin'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function AdminManagement() {
  const { isOwner, currentUser } = useAuth();
  const [companions, setCompanions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'profile_companion'),
      (snap) => {
        setCompanions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setError(null);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'profile_companion');
        setError('Gagal memuat data companion. Periksa koneksi atau Firestore rules.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const admins = useMemo(
    () => companions.filter((c) => toAdminLevel(c.admin_level) > 0),
    [companions]
  );
  const nonAdmins = useMemo(
    () => companions.filter((c) => toAdminLevel(c.admin_level) === 0),
    [companions]
  );

  // Owner-only page.
  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  const setAdminLevel = async (companionId: string, level: AdminLevel) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'profile_companion', companionId), { admin_level: level });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `profile_companion/${companionId}`);
      setError('Gagal menyimpan perubahan admin. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (level: 1 | 2) => {
    if (!editTarget) return;
    await setAdminLevel(editTarget.id, level);
    setEditTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await setAdminLevel(deleteTarget.id, 0);
    setDeleteTarget(null);
  };

  const handleAdd = async (companionId: string, level: 1 | 2) => {
    await setAdminLevel(companionId, level);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 z-10 relative">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Admin Management
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <ShieldPlus size={16} />
          Tambah Admin
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <span className="text-red-500 mt-0.5">⚠</span>
          <p className="text-red-500 text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-400 text-lg leading-none">×</button>
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-white/5">
              <tr className="h-10 text-xs uppercase text-slate-500">
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Admin Role</th>
                <th className="px-4 py-2 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span className="text-xs">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    Belum ada admin. Klik "Tambah Admin" untuk mengangkat companion.
                  </td>
                </tr>
              ) : (
                admins.map((comp) => {
                  const level = toAdminLevel(comp.admin_level);
                  const isSelf = comp.id === currentUser?.uid;
                  return (
                    <tr
                      key={comp.id}
                      className="h-12 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">
                        {comp.name_companion ?? comp.name ?? '—'}
                        {isSelf && <span className="ml-2 text-[10px] uppercase text-primary-500 font-semibold">You</span>}
                      </td>
                      <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                        {comp.email ?? '-'}
                      </td>
                      <td className="px-4 py-2">
                        {level === 3 ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-500">
                            Owner
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            level === 1
                              ? 'bg-sky-500/15 text-sky-500'
                              : 'bg-emerald-500/15 text-emerald-500'
                          }`}>
                            {LEVEL_LABEL[level]}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditTarget(comp)}
                            disabled={level === 3}
                            title={level === 3 ? 'Owner tidak dapat diubah' : 'Edit role admin'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(comp)}
                            disabled={level === 3}
                            title={level === 3 ? 'Owner tidak dapat dihapus' : 'Turunkan ke level 0'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ShieldOff size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editTarget && (
        <EditLevelModal
          companion={editTarget}
          saving={saving}
          onClose={() => setEditTarget(null)}
          onSave={handleEditSave}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          companion={deleteTarget}
          saving={saving}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showAddModal && (
        <AddAdminModal
          candidates={nonAdmins}
          saving={saving}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
