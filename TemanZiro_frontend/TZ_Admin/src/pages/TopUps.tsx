import { useEffect, useState } from 'react';
import {
  collectionGroup, onSnapshot, query, orderBy,
  doc, updateDoc, runTransaction,
  Timestamp, serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase_config';
import { format } from 'date-fns';
import { X } from 'lucide-react';

// ── BUG-08 FIX ────────────────────────────────────────────────────────────────
function toDate(val: number | Timestamp | Date | undefined): Date {
  if (!val) return new Date();
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date(val);
}

// ── Balance helpers ───────────────────────────────────────────────────────────
// Firestore menyimpan balance_user sebagai STRING (misal: "150000").
// parseInt bukan parseFloat — Rupiah selalu bilangan bulat,
// float arithmetic (IEEE 754) bisa menyebabkan pembulatan seperti
// 10000 + 500 = 10499.999999999998
function parseBalance(val: string | number | undefined | null): number {
  if (val === undefined || val === null || val === '') return 0;
  const parsed = parseInt(String(val).replace(/\D/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
}

function balanceToString(val: number): string {
  return String(Math.trunc(val));
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface TopUpRequest {
  id: string;
  uid: string;
  amount: number | string;
  created_at: Timestamp | number | Date;
  status: 'Menunggu' | 'Berhasil' | 'Ditolak';
  decline_reason?: string;
}

// ── Decline Modal ─────────────────────────────────────────────────────────────
interface DeclineModalProps {
  target: TopUpRequest;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}

function DeclineModal({ target, onConfirm, onCancel, loading }: DeclineModalProps) {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-white">Tolak Top Up</h3>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-slate-400 hover:text-white transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info request */}
        <div className="mb-4 mt-3 bg-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-slate-400 text-xs">Amount</span>
          <span className="text-emerald-400 font-mono text-sm">
            Rp {parseBalance(target.amount).toLocaleString('id-ID')}
          </span>
        </div>

        <p className="text-slate-400 text-sm mb-3">
          Masukkan alasan penolakan. Alasan ini akan tersimpan di dokumen request.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Contoh: Bukti transfer tidak valid atau tidak terbaca..."
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 resize-none transition-colors"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-300 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading || reason.trim() === ''}
            className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-sm text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Tolak Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TopUps() {
  const [topups, setTopups] = useState<TopUpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [declineTarget, setDeclineTarget] = useState<TopUpRequest | null>(null);
  const [declineLoading, setDeclineLoading] = useState(false);

  // ── Fetch: collectionGroup 'requests' di bawah top_ups/{uid} ─────────────
  useEffect(() => {
    const q = query(
      collectionGroup(db, 'requests'),
      orderBy('created_at', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .filter((d) => d.ref.parent.parent?.parent?.id === 'top_ups')
          .map((d) => ({
            id: d.id,
            uid: d.ref.parent.parent!.id,
            ...d.data(),
          })) as TopUpRequest[];

        setTopups(docs);
        setError(null);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'top_ups/*/requests');
        setError('Gagal memuat data top up. Periksa koneksi atau Firestore rules.');
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // ── Accept: update status + tambah balance via transaction ────────────────
  // BUG-02 FIX: runTransaction agar atomic — jika salah satu gagal, keduanya rollback.
  // Balance dibaca/tulis sebagai STRING, aritmetika pakai integer (parseInt).
  const handleAccept = async (tx: TopUpRequest) => {
    setProcessingId(tx.id);
    try {
      const requestRef = doc(db, 'top_ups', tx.uid, 'requests', tx.id);
      const userRef    = doc(db, 'profile_user', tx.uid);

      const incomingAmount = parseBalance(tx.amount);

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        // Baca balance lama sebagai string → parse ke integer
        const currentBalance = userSnap.exists()
          ? parseBalance(userSnap.data().balance_user)
          : 0;

        // Aritmetika integer — tidak ada float, tidak ada pembulatan
        const newBalance = currentBalance + incomingAmount;

        transaction.update(requestRef, {
          status: 'Berhasil',
          updated_at: serverTimestamp(),
        });

        if (userSnap.exists()) {
          transaction.update(userRef, {
            balance_user: balanceToString(newBalance),
            updatedAt: serverTimestamp(),
          });
        } else {
          // Buat dokumen baru jika belum ada (edge case)
          transaction.set(userRef, {
            balance_user: balanceToString(incomingAmount),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `top_ups/${tx.uid}/requests/${tx.id}`);
    } finally {
      setProcessingId(null);
    }
  };

  // ── Decline: update status + simpan alasan ────────────────────────────────
  const handleDeclineConfirm = async (reason: string) => {
    if (!declineTarget) return;
    setDeclineLoading(true);
    try {
      await updateDoc(
        doc(db, 'top_ups', declineTarget.uid, 'requests', declineTarget.id),
        {
          status: 'Ditolak',
          decline_reason: reason.trim(),
          updated_at: serverTimestamp(),
        }
      );
      setDeclineTarget(null);
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.UPDATE,
        `top_ups/${declineTarget.uid}/requests/${declineTarget.id}`
      );
    } finally {
      setDeclineLoading(false);
    }
  };

  // ── Status badge helper ───────────────────────────────────────────────────
  const statusPill = (status: string) => {
    switch (status) {
      case 'Berhasil': return 'bg-green-500/20 text-green-400';
      case 'Ditolak': return 'bg-red-500/20 text-red-400';
      default:         return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <>
      {/* Decline Modal */}
      {declineTarget && (
        <DeclineModal
          target={declineTarget}
          onConfirm={handleDeclineConfirm}
          onCancel={() => !declineLoading && setDeclineTarget(null)}
          loading={declineLoading}
        />
      )}

      <div className="space-y-6 z-10 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">Top Up Requests</h2>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden mt-6">
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500 border-b border-white/5">
                <tr className="h-10 text-xs uppercase">
                  <th className="px-4 py-2 font-medium">Request ID</th>
                  <th className="px-4 py-2 font-medium">User ID</th>
                  <th className="px-4 py-2 font-medium">Amount</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Tanggal</th>
                  <th className="px-4 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-rose-400">
                      {error}
                    </td>
                  </tr>
                ) : topups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Tidak ada request top up.
                    </td>
                  </tr>
                ) : (
                  topups.map((tx) => (
                    <tr
                      key={tx.id}
                      className="h-12 border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-2 text-slate-500 font-mono text-[10px]">
                        {tx.id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-2 font-mono text-slate-400 text-[10px]">
                        {tx.uid.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-2 text-emerald-400 font-mono">
                        +Rp {parseBalance(tx.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col gap-0.5">
                          <span className={`status-pill w-fit ${statusPill(tx.status)}`}>
                            {tx.status}
                          </span>
                          {/* Tampilkan alasan jika DECLINED */}
                          {tx.status === 'Ditolak' && tx.decline_reason && (
                            <span className="text-[10px] text-slate-500 italic px-1">
                              "{tx.decline_reason}"
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-slate-400 text-xs">
                        {/* BUG-08 FIX */}
                        {tx.created_at
                          ? format(toDate(tx.created_at), 'MMM dd, yyyy HH:mm')
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {tx.status === 'Menunggu' ? (
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleAccept(tx)}
                              disabled={processingId === tx.id}
                              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors text-[10px] uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {processingId === tx.id ? '...' : 'Accept'}
                            </button>
                            <button
                              onClick={() => setDeclineTarget(tx)}
                              disabled={processingId === tx.id}
                              className="text-red-400 hover:text-red-300 font-semibold transition-colors text-[10px] uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-[10px] uppercase font-semibold">
                            Done
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}