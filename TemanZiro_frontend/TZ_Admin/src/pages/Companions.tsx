import { useEffect, useState } from 'react';
import {
  collection, onSnapshot, query, orderBy,
  Timestamp, doc, updateDoc, getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase_config';
import { format } from 'date-fns';

function toDate(val: number | Timestamp | Date | undefined): Date {
  if (!val) return new Date();
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date(val);
}

function parseBalance(val: string | number | undefined | null): number {
  if (val === undefined || val === null || val === '') return 0;
  const parsed = parseInt(String(val).replace(/\D/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
}

export default function Companions() {
  const [companions, setCompanions] = useState<any[]>([]);
  const [sessionCounts, setSessionCounts] = useState<Map<string, number>>(new Map());
  const [activeStatus, setActiveStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchActiveStatuses = async (list: any[]) => {
    try {
      const entries = await Promise.all(
        list.map(async (comp) => {
          const snap = await getDoc(doc(db, 'user_details', comp.id));
          const isActive = snap.exists() ? (snap.data()?.is_active === true) : false;
          return [comp.id, isActive] as [string, boolean];
        })
      );
      setActiveStatus(Object.fromEntries(entries));
    } catch (err) {
      console.error('Gagal fetch active statuses:', err);
    }
  };

  const toggleActive = async (uid: string) => {
    setTogglingId(uid);
    try {
      const current = activeStatus[uid] ?? false;
      await updateDoc(doc(db, 'user_details', uid), { is_active: !current });
      setActiveStatus((prev) => ({ ...prev, [uid]: !current }));
    } catch (err) {
      console.error('Gagal update is_active:', err);
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'profile_companion'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCompanions(list);
        setError(null);
        setLoading(false);
        fetchActiveStatuses(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'profile_companion');
        setError('Gagal memuat data companions. Periksa koneksi atau Firestore rules.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'bookings_companion'),
      (snap) => {
        const map = new Map<string, number>();
        snap.docs.forEach((d) => {
          const bookings = d.data().bookings;
          map.set(d.id, Array.isArray(bookings) ? bookings.length : 0);
        });
        setSessionCounts(map);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'bookings_companion')
    );
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6 z-10 relative">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        Companion Management
      </h2>

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
                <th className="px-4 py-2 font-medium">Balance</th>
                <th className="px-4 py-2 font-medium">Total Sesi</th>
                <th className="px-4 py-2 font-medium">Joined</th>
                <th className="px-4 py-2 font-medium text-center">Aktif</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span className="text-xs">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : companions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Belum ada data companion.
                  </td>
                </tr>
              ) : (
                companions.map((comp) => {
                  const isActive = activeStatus[comp.id] ?? false;
                  const isToggling = togglingId === comp.id;
                  return (
                    <tr
                      key={comp.id}
                      className="h-12 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">
                        {comp.name_companion ?? '—'}
                      </td>
                      <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                        {comp.email ?? '-'}
                      </td>
                      <td className="px-4 py-2 text-green-600 dark:text-green-400 font-mono">
                        Rp {parseBalance(comp.balance).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-2">
                        <span className="font-mono text-sky-600 dark:text-sky-400">
                          {sessionCounts.get(comp.id) ?? 0}
                          <span className="text-slate-400 text-xs ml-1">sesi</span>
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                        {comp.createdAt ? format(toDate(comp.createdAt), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => toggleActive(comp.id)}
                          disabled={isToggling}
                          title={isActive ? 'Nonaktifkan companion' : 'Aktifkan companion'}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                            isActive ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                              isActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}