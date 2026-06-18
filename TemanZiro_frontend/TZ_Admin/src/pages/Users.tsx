import { useEffect, useState } from 'react';
import {
  collection, onSnapshot, query, orderBy,
  Timestamp, getCountFromServer, doc, updateDoc, getDoc
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

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [activeStatus, setActiveStatus] = useState<Record<string, boolean>>({});
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-6 z-10 relative">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        User Management
      </h2>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-white/5">
              <tr className="h-10 text-xs uppercase text-slate-500">
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Balance</th>
                <th className="px-4 py-2 font-medium">Total Bookings</th>
                <th className="px-4 py-2 font-medium">Joined</th>
                <th className="px-4 py-2 font-medium text-center">Aktif</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-rose-500">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isActive = activeStatus[user.id] ?? false;
                  const isToggling = togglingId === user.id;
                  return (
                    <tr
                      key={user.id}
                      className="h-12 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">
                        {user.name_user}
                      </td>
                      <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                        {user.email || '-'}
                      </td>
                      <td className="px-4 py-2 text-green-600 dark:text-green-400 font-mono">
                        Rp {parseBalance(user.balance_user).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-2">
                        {bookingCounts[user.id] !== undefined ? (
                          <span className="font-mono text-sky-600 dark:text-sky-400">
                            {bookingCounts[user.id]}
                            <span className="text-slate-400 text-xs ml-1">booking(s)</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">...</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                        {user.createdAt ? format(toDate(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-center">
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