import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  setDoc,
  runTransaction,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase_config';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import DataTable, { type DataTableColumn } from '../components/DataTable';
import { useAuthEmails } from '../hooks/useAuthEmails';

// ─── Helper ──────────────────────────────────────────────────────────────────
// BUG-08: createdAt bisa berupa number (Date.now()) atau Firestore Timestamp
function toDate(val: number | Timestamp | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val === 'number') return new Date(val);
  return null;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface WithdrawDoc {
  id: string;
  companionId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number | Timestamp;
  updatedAt: number | Timestamp;
}

// ─── Confirmation Modal ───────────────────────────────────────────────────────
interface ConfirmModalProps {
  action: 'approved' | 'rejected';
  txId: string;
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ action, txId, amount, onConfirm, onCancel }: ConfirmModalProps) {
  const isApprove = action === 'approved';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel rounded-2xl p-6 w-full max-w-sm space-y-4 mx-4">
        <h3 className="text-white font-bold text-lg">
          {isApprove ? '✅ Approve Withdraw' : '❌ Reject Withdraw'}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          {isApprove
            ? <>Konfirmasi approve withdraw sebesar <span className="text-rose-400 font-mono font-semibold">${amount.toFixed(2)}</span>? Balance companion tidak akan berubah.</>
            : <>Konfirmasi reject withdraw sebesar <span className="text-rose-400 font-mono font-semibold">${amount.toFixed(2)}</span>? Balance companion akan <span className="text-emerald-400 font-semibold">dikembalikan</span>.</>
          }
        </p>
        <p className="text-slate-600 font-mono text-xs">ID: {txId}</p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/30 text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isApprove
                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
          >
            {isApprove ? 'Ya, Approve' : 'Ya, Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Withdraws() {
  const [withdraws, setWithdraws] = useState<WithdrawDoc[]>([]);
  const [companionNames, setCompanionNames] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { emails, loading: emailsLoading } = useAuthEmails(withdraws.map((w) => w.companionId));

  // Confirmation state
  const [confirm, setConfirm] = useState<{
    id: string;
    action: 'approved' | 'rejected';
    companionId: string;
    amount: number;
  } | null>(null);

  // Fetch semua nama companion sekali untuk lookup di tabel
  useEffect(() => {
    getDocs(collection(db, 'profile_companion'))
      .then((snap) => {
        const map = new Map<string, string>();
        snap.docs.forEach((d) => {
          map.set(d.id, d.data().name ?? '—');
        });
        setCompanionNames(map);
      })
      .catch((err) => {
        handleFirestoreError(err, OperationType.LIST, 'profile_companion');
      });
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'withdraws'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setWithdraws(snap.docs.map((d) => ({ id: d.id, ...d.data() } as WithdrawDoc)));
        setLoading(false);
        setError(null);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'withdraws');
        setError('Gagal memuat data withdraw. Periksa koneksi atau izin Firestore.');  // BUG-14
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const updateStatus = async (
    id: string,
    status: 'approved' | 'rejected',
    companionId: string,
    amount: number
  ) => {
    setProcessingId(id);
    try {
      if (status === 'rejected') {
        // BUG-02: Reject → kembalikan balance ke companion via transaction (atomic)
        await runTransaction(db, async (transaction) => {
          const companionRef = doc(db, 'profile_companion', companionId);
          const companionSnap = await transaction.get(companionRef);

          if (!companionSnap.exists()) {
            throw new Error(`Companion ${companionId} tidak ditemukan.`);
          }

          const currentBalance: number = companionSnap.data().balance ?? 0;

          transaction.update(companionRef, {
            balance: currentBalance + amount,
            updatedAt: Date.now(),
          });

          transaction.update(doc(db, 'withdraws', id), {
            status: 'rejected',
            updatedAt: Date.now(),
          });
        });
      } else {
        // BUG-02: Approve → hanya update status, balance sudah dikurangi saat request dibuat
        await updateDoc(doc(db, 'withdraws', id), {
          status: 'approved',
          updatedAt: Date.now(),
        });
      }

      // Log activity
      const activityId = Date.now().toString();
      await setDoc(doc(db, 'activities', activityId), {
        id: activityId,
        type: 'withdraw',
        description: `Withdraw ${status} — $${amount.toFixed(2)} untuk companion ${companionId.substring(0, 8)}`,
        isRead: false,
        createdAt: Date.now(),
      });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `withdraws/${id}`);
      setError(err?.message ?? 'Terjadi kesalahan saat memproses withdraw.');
    } finally {
      setProcessingId(null);
      setConfirm(null);
    }
  };

  const handleAction = (
    id: string,
    action: 'approved' | 'rejected',
    companionId: string,
    amount: number
  ) => {
    setConfirm({ id, action, companionId, amount });
  };

  const columns: DataTableColumn<WithdrawDoc>[] = [
    {
      id: 'withdrawId',
      header: 'Withdraw ID',
      sortValue: (tx) => tx.id,
      cell: (tx) => (
        <span className="text-slate-400 font-mono text-xs select-all">{tx.id}</span>
      ),
    },
    {
      id: 'companion',
      header: 'Companion',
      sortValue: (tx) => (companionNames.get(tx.companionId) ?? emails[tx.companionId] ?? tx.companionId).toLowerCase(),
      searchValue: (tx) => `${companionNames.get(tx.companionId) ?? ''} ${emails[tx.companionId] ?? ''} ${tx.companionId}`,
      cell: (tx) => (
        <>
          <div className="font-medium text-white">
            {companionNames.get(tx.companionId) ?? (
              <span className="text-slate-500 font-mono text-xs">{tx.companionId}</span>
            )}
          </div>
          <div className="text-slate-600 font-mono text-[10px]">
            {emails[tx.companionId] ?? (emailsLoading ? '...' : tx.companionId)}
          </div>
        </>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      sortValue: (tx) => tx.amount,
      cell: (tx) => (
        <span className="text-rose-400 font-mono">-${tx.amount.toFixed(2)}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      sortValue: (tx) => tx.status,
      cell: (tx) => (
        <span
          className={`status-pill ${
            tx.status === 'approved'
              ? 'bg-green-500/20 text-green-500'
              : tx.status === 'rejected'
              ? 'bg-red-500/20 text-red-500'
              : 'bg-yellow-500/20 text-yellow-500'
          }`}
        >
          {tx.status}
        </span>
      ),
    },
    {
      id: 'date',
      header: 'Date',
      sortValue: (tx) => {
        const d = toDate(tx.createdAt);
        return d ? d.getTime() : 0;
      },
      cell: (tx) => {
        const date = toDate(tx.createdAt); // BUG-08: safe conversion
        return (
          <span className="text-slate-400">
            {date ? format(date, 'MMM dd, yyyy HH:mm') : 'N/A'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (tx) => {
        const isProcessing = processingId === tx.id;
        if (isProcessing) {
          return (
            <span className="text-slate-500 text-[10px] uppercase font-semibold">
              Processing…
            </span>
          );
        }
        if (tx.status !== 'pending') {
          return (
            <span className="text-slate-600 text-[10px] uppercase font-semibold">
              Done
            </span>
          );
        }
        return (
          <div className="space-x-3">
            <button
              onClick={() => handleAction(tx.id, 'approved', tx.companionId, tx.amount)}
              className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors text-[10px] uppercase tracking-wider"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(tx.id, 'rejected', tx.companionId, tx.amount)}
              className="text-red-500 hover:text-red-400 font-semibold transition-colors text-[10px] uppercase tracking-wider"
            >
              Reject
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 z-10 relative">
      {/* Confirmation Modal */}
      {confirm && (
        <ConfirmModal
          action={confirm.action}
          txId={confirm.id}
          amount={confirm.amount}
          onConfirm={() => updateStatus(confirm.id, confirm.action, confirm.companionId, confirm.amount)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Withdraw Requests</h2>
      </div>

      {/* BUG-14: Error banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <span className="text-red-400 mt-0.5 text-base">⚠</span>
          <div className="flex-1">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400/60 hover:text-red-400 text-lg leading-none transition-colors"
          >
            ×
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={withdraws}
        rowKey={(tx) => tx.id}
        loading={loading}
        emptyMessage="Belum ada withdraw request."
        searchPlaceholder="Cari nama, email, atau ID companion..."
      />
    </div>
  );
}
