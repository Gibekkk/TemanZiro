import { useEffect, useState } from 'react';
import {
  collection, onSnapshot, query, orderBy,
  Timestamp, getCountFromServer, doc, updateDoc, getDoc
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

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [activeStatus, setActiveStatus] = useState<Record<string, boolean>>({});
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { emails, loading: emailsLoading } = useAuthEmails(users.map((u) => u.id));

  const fetchBookingCounts = async (userList: any[]) => {
    try {
      const entries = await Promise.all(
        userList.map(async (user) => {
          const subCol = collection(db, 'bookings', user.id, 'booking');
          const snap = await getCountFromServer(subCol);
          return [user.id, snap.data().count] as [string, number];
        })
      );
      setBookingCounts(Object.fromEntries(entries));
    } catch (err) {
      console.error('Gagal fetch booking counts:', err);
    }
  };

  const fetchActiveStatuses = async (userList: any[]) => {
    try {
      const entries = await Promise.all(
        userList.map(async (user) => {
          const snap = await getDoc(doc(db, 'user_details', user.id));
          const isActive = snap.exists() ? (snap.data()?.is_active === true) : false;
          return [user.id, isActive] as [string, boolean];
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
    const q = query(collection(db, 'profile_user'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const userList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(userList);
        setError(null);
        setLoading(false);
        fetchBookingCounts(userList);
        fetchActiveStatuses(userList);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'profile_user');
        setError('Gagal memuat data users. Periksa koneksi atau Firestore rules.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const columns: DataTableColumn<any>[] = [
    {
      id: 'name',
      header: 'Name',
      sortValue: (user) => (user.name_user ?? '').toLowerCase(),
      searchValue: (user) => user.name_user ?? '',
      cell: (user) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {user.name_user}
        </span>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      sortValue: (user) => (emails[user.id] ?? '').toLowerCase(),
      searchValue: (user) => emails[user.id] ?? '',
      cell: (user) => (
        <span className="text-slate-500 dark:text-slate-400">
          {emails[user.id] ?? (emailsLoading ? '...' : '-')}
        </span>
      ),
    },
    {
      id: 'balance',
      header: 'Balance',
      sortValue: (user) => parseBalance(user.balance_user),
      cell: (user) => (
        <span className="text-green-600 dark:text-green-400 font-mono">
          Rp {parseBalance(user.balance_user).toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      id: 'bookings',
      header: 'Total Bookings',
      sortValue: (user) => bookingCounts[user.id] ?? -1,
      cell: (user) =>
        bookingCounts[user.id] !== undefined ? (
          <span className="font-mono text-sky-600 dark:text-sky-400">
            {bookingCounts[user.id]}
            <span className="text-slate-400 text-xs ml-1">booking(s)</span>
          </span>
        ) : (
          <span className="text-slate-400 text-xs">...</span>
        ),
    },
    {
      id: 'joined',
      header: 'Joined',
      sortValue: (user) => (user.createdAt ? toDate(user.createdAt).getTime() : 0),
      cell: (user) => (
        <span className="text-slate-500 dark:text-slate-400">
          {user.createdAt ? format(toDate(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
        </span>
      ),
    },
    {
      id: 'active',
      header: 'Aktif',
      align: 'center',
      sortValue: (user) => (activeStatus[user.id] ?? false ? 1 : 0),
      cell: (user) => {
        const isActive = activeStatus[user.id] ?? false;
        const isToggling = togglingId === user.id;
        return (
          <button
            onClick={() => toggleActive(user.id)}
            disabled={isToggling}
            title={isActive ? 'Nonaktifkan user' : 'Aktifkan user'}
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
        User Management
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
        data={users}
        rowKey={(user) => user.id}
        loading={loading}
        emptyMessage="No users found."
        searchPlaceholder="Cari nama atau email user..."
      />
    </div>
  );
}
