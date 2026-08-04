import { useEffect, useState } from 'react';
import {
  collection, onSnapshot, query, orderBy,
  Timestamp, doc, updateDoc, getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase_config';
import { format } from 'date-fns';
import DataTable, { type DataTableColumn } from '../components/DataTable';
import { useAuthEmails } from '../hooks/useAuthEmails';

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

  const { emails, loading: emailsLoading } = useAuthEmails(companions.map((c) => c.id));

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

  const columns: DataTableColumn<any>[] = [
    {
      id: 'name',
      header: 'Name',
      sortValue: (comp) => (comp.name_companion ?? '').toLowerCase(),
      searchValue: (comp) => comp.name_companion ?? '',
      cell: (comp) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {comp.name_companion ?? '—'}
        </span>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      sortValue: (comp) => (emails[comp.id] ?? '').toLowerCase(),
      searchValue: (comp) => emails[comp.id] ?? '',
      cell: (comp) => (
        <span className="text-slate-500 dark:text-slate-400">
          {emails[comp.id] ?? (emailsLoading ? '...' : '-')}
        </span>
      ),
    },
    {
      id: 'balance',
      header: 'Balance',
      sortValue: (comp) => parseBalance(comp.balance),
      cell: (comp) => (
        <span className="text-green-600 dark:text-green-400 font-mono">
          Rp {parseBalance(comp.balance).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      id: 'sessions',
      header: 'Total Sesi',
      sortValue: (comp) => sessionCounts.get(comp.id) ?? 0,
      cell: (comp) => (
        <span className="font-mono text-sky-600 dark:text-sky-400">
          {sessionCounts.get(comp.id) ?? 0}
          <span className="text-slate-400 text-xs ml-1">sesi</span>
        </span>
      ),
    },
    {
      id: 'joined',
      header: 'Joined',
      sortValue: (comp) => (comp.createdAt ? toDate(comp.createdAt).getTime() : 0),
      cell: (comp) => (
        <span className="text-slate-500 dark:text-slate-400">
          {comp.createdAt ? format(toDate(comp.createdAt), 'MMM dd, yyyy') : 'N/A'}
        </span>
      ),
    },
    {
      id: 'active',
      header: 'Aktif',
      align: 'center',
      sortValue: (comp) => (activeStatus[comp.id] ?? false ? 1 : 0),
      cell: (comp) => {
        const isActive = activeStatus[comp.id] ?? false;
        const isToggling = togglingId === comp.id;
        return (
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
        );
      },
    },
  ];

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

      <DataTable
        columns={columns}
        data={companions}
        rowKey={(comp) => comp.id}
        loading={loading}
        emptyMessage="Belum ada data companion."
        searchPlaceholder="Cari nama atau email companion..."
      />
    </div>
  );
}
