import { useEffect, useMemo, useState } from 'react';
import {
  collection, onSnapshot, query, orderBy,
  collectionGroup, Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase_config';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Users, UserSquare2, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { format, startOfMonth, subMonths } from 'date-fns';

// ── Helpers ────────────────────────────────────────────────────────────────────
function toDate(val: number | Timestamp | Date | undefined | null): Date {
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

const THIS_MONTH_MS = startOfMonth(new Date()).getTime();

// ── Types ──────────────────────────────────────────────────────────────────────
interface FeedItem {
  id: string;
  uid: string;
  description: string;
  status: string;
  created_at: Timestamp | number | Date;
  type: 'topup' | 'withdraw';
  decline_reason?: string;
}

interface RawUser {
  id: string;
  createdAt: Timestamp | number | undefined;
}

interface RawCompanion {
  id: string;
  createdAt: Timestamp | number | undefined;
}

interface RawTopup {
  id: string;
  uid: string;
  amount: string | number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  created_at: Timestamp | number | Date;
  decline_reason?: string;
}

interface RawWithdraw {
  id: string;
  companionId: string;
  amount: string | number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp | number;
  decline_reason?: string;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [allUsers, setAllUsers]         = useState<RawUser[]>([]);
  const [allCompanions, setAllCompanions] = useState<RawCompanion[]>([]);
  const [allTopups, setAllTopups]       = useState<RawTopup[]>([]);
  const [allWithdraws, setAllWithdraws] = useState<RawWithdraw[]>([]);
  const [feedError, setFeedError]       = useState<string | null>(null);

  // ── 1. Users ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    return onSnapshot(collection(db, 'profile_user'), (snap) => {
      setAllUsers(snap.docs.map((d) => ({ id: d.id, createdAt: d.data().createdAt })));
    });
  }, []);

  // ── 2. Companions ─────────────────────────────────────────────────────────────
  useEffect(() => {
    return onSnapshot(collection(db, 'profile_companion'), (snap) => {
      setAllCompanions(snap.docs.map((d) => ({ id: d.id, createdAt: d.data().createdAt })));
    });
  }, []);

  // ── 3. TopUps — collectionGroup 'requests' di bawah top_ups/{uid} ────────────
  useEffect(() => {
    const q = query(collectionGroup(db, 'requests'), orderBy('created_at', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs
          .filter((d) => d.ref.parent.parent?.parent?.id === 'top_ups')
          .map((d) => ({
            id: d.id,
            uid: d.ref.parent.parent!.id,
            ...d.data(),
          })) as RawTopup[];
        setAllTopups(docs);
        setFeedError(null);
      },
      (err) => {
        console.error('TopUps error:', err);
        setFeedError('Gagal memuat data topup.');
      }
    );
  }, []);

  // ── 4. Withdraws — flat collection 'withdraws' ────────────────────────────────
  useEffect(() => {
    const q = query(collection(db, 'withdraws'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        setAllWithdraws(snap.docs.map((d) => ({ id: d.id, ...d.data() } as RawWithdraw)));
      },
      (err) => {
        console.error('Withdraws error:', err);
      }
    );
  }, []);

  // ── Stat computations ─────────────────────────────────────────────────────────
  const totalUsers      = allUsers.length;
  const totalCompanions = allCompanions.length;

  const topupThisMonth = useMemo(() =>
    allTopups
      .filter((t) => t.status === 'ACCEPTED' && toDate(t.created_at).getTime() >= THIS_MONTH_MS)
      .reduce((sum, t) => sum + parseBalance(t.amount), 0),
  [allTopups]);

  const withdrawThisMonth = useMemo(() =>
    allWithdraws
      .filter((w) => w.status === 'approved' && toDate(w.createdAt).getTime() >= THIS_MONTH_MS)
      .reduce((sum, w) => sum + parseBalance(w.amount), 0),
  [allWithdraws]);

  // ── Chart data: 7 bulan terakhir ──────────────────────────────────────────────
  // Setiap entry = { name, users, companions, topups, withdraws }
  // users/companions = jumlah registrasi, topups/withdraws = jumlah transaksi
  const chartData = useMemo(() => {
    // Buat bucket untuk 7 bulan terakhir
    const buckets: Record<string, {
      name: string;
      users: number;
      companions: number;
      topups: number;
      withdraws: number;
    }> = {};

    for (let i = 6; i >= 0; i--) {
      const key = format(startOfMonth(subMonths(new Date(), i)), 'MMM yy');
      buckets[key] = { name: key, users: 0, companions: 0, topups: 0, withdraws: 0 };
    }

    // Hitung user baru per bulan berdasarkan createdAt
    allUsers.forEach((u) => {
      const key = format(toDate(u.createdAt), 'MMM yy');
      if (buckets[key]) buckets[key].users++;
    });

    // Hitung companion baru per bulan berdasarkan createdAt
    allCompanions.forEach((c) => {
      const key = format(toDate(c.createdAt), 'MMM yy');
      if (buckets[key]) buckets[key].companions++;
    });

    // Hitung topup ACCEPTED per bulan berdasarkan created_at
    allTopups
      .filter((t) => t.status === 'ACCEPTED')
      .forEach((t) => {
        const key = format(toDate(t.created_at), 'MMM yy');
        if (buckets[key]) buckets[key].topups++;
      });

    // Hitung withdraw approved per bulan berdasarkan createdAt
    allWithdraws
      .filter((w) => w.status === 'approved')
      .forEach((w) => {
        const key = format(toDate(w.createdAt), 'MMM yy');
        if (buckets[key]) buckets[key].withdraws++;
      });

    return Object.values(buckets);
  }, [allUsers, allCompanions, allTopups, allWithdraws]);

  // ── Feed: 5 topup + 5 withdraw terbaru → merge → sort → top 10 ───────────────
  const sortedFeed = useMemo(() => {
    const topupItems: FeedItem[] = allTopups.slice(0, 5).map((t) => ({
      id: t.id,
      uid: t.uid,
      type: 'topup',
      description: `Top-up Rp ${parseBalance(t.amount).toLocaleString('id-ID')}`,
      status: t.status,
      created_at: t.created_at,
      decline_reason: t.decline_reason,
    }));

    const withdrawItems: FeedItem[] = allWithdraws.slice(0, 5).map((w) => ({
      id: w.id,
      uid: w.companionId,
      type: 'withdraw',
      description: `Withdraw Rp ${parseBalance(w.amount).toLocaleString('id-ID')}`,
      status: w.status,
      created_at: w.createdAt,
      decline_reason: w.decline_reason,
    }));

    return [...topupItems, ...withdrawItems]
      .sort((a, b) => toDate(b.created_at).getTime() - toDate(a.created_at).getTime())
      .slice(0, 10);
  }, [allTopups, allWithdraws]);

  // ── Feed helpers ──────────────────────────────────────────────────────────────
  const getDotColor = (item: FeedItem) => {
    const s = item.status.toLowerCase();
    if (s === 'accepted' || s === 'approved') return 'bg-emerald-500';
    if (s === 'declined' || s === 'rejected') return 'bg-red-500';
    return 'bg-slate-500'; // pending
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'accepted' || s === 'approved') return 'text-green-400';
    if (s === 'declined' || s === 'rejected') return 'text-red-400';
    return 'text-slate-400';
  };

  const isDeclined = (status: string) =>
    status === 'DECLINED' || status === 'rejected';

  const bulanIni = format(new Date(), 'MMMM yyyy');

  return (
    <div className="space-y-6 z-10 relative">
      <div className="hidden md:block">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Overview Dashboard</h2>
        <p className="text-slate-500 text-sm">
          Data real-time dari Firestore • {format(new Date(), 'dd MMMM yyyy, HH:mm')}
        </p>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
        <StatCard
          title="Total Users"
          value={totalUsers.toLocaleString('id-ID')}
          icon={Users}
          color="bg-blue-500"
          note="semua waktu"
        />
        <StatCard
          title="Total Companions"
          value={totalCompanions.toLocaleString('id-ID')}
          icon={UserSquare2}
          color="bg-primary-500"
          note="semua waktu"
        />
        <StatCard
          title="TopUp Diterima"
          value={`Rp ${topupThisMonth.toLocaleString('id-ID')}`}
          icon={ArrowDownToLine}
          color="bg-emerald-500"
          note={bulanIni}
        />
        <StatCard
          title="Withdraw Disetujui"
          value={`Rp ${withdrawThisMonth.toLocaleString('id-ID')}`}
          icon={ArrowUpFromLine}
          color="bg-rose-500"
          note={bulanIni}
        />
      </div>

      {/* ── Chart + Feed ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col p-6">
          <h3 className="font-semibold mb-1 text-white">Pertumbuhan Platform</h3>
          <p className="text-xs text-slate-500 mb-4">
            Registrasi & transaksi per bulan — 7 bulan terakhir
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#102a43',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '16px' }} />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="User Baru"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="companions"
                  name="Companion Baru"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="topups"
                  name="TopUp Accepted"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="withdraws"
                  name="Withdraw Approved"
                  stroke="#f43f5e"
                  fill="#f43f5e"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feed */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <h3 className="font-semibold mb-4 text-white">Aktivitas Terbaru</h3>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {feedError ? (
              <p className="text-rose-400 text-sm">{feedError}</p>
            ) : sortedFeed.length === 0 ? (
              <p className="text-slate-500 text-sm">Belum ada aktivitas.</p>
            ) : (
              sortedFeed.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-start space-x-3">
                  {/* Dot */}
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getDotColor(item)}`} />

                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-200">{item.description}</div>

                    {/* Full UID */}
                    <div className="text-[10px] text-slate-600 font-mono break-all mt-0.5">
                      {item.uid}
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {/* Status badge — declined punya hover tooltip */}
                      <div className="relative group inline-block">
                        <span
                          className={`text-[10px] font-semibold uppercase ${getStatusColor(item.status)} ${
                            isDeclined(item.status) && item.decline_reason
                              ? 'cursor-help underline decoration-dotted underline-offset-2'
                              : ''
                          }`}
                        >
                          {item.status}
                        </span>

                        {/* Tooltip alasan decline */}
                        {isDeclined(item.status) && item.decline_reason && (
                          <div className="absolute bottom-full left-0 mb-2 w-56 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30 shadow-2xl">
                            <span className="text-slate-500 text-[10px] uppercase font-semibold block mb-1">
                              Alasan Penolakan
                            </span>
                            <span className="text-slate-300 text-xs leading-relaxed">
                              {item.decline_reason}
                            </span>
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-500">
                        {format(toDate(item.created_at), 'dd MMM, HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────────
function StatCard({
  title, value, icon: Icon, color, note,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  note: string;
}) {
  return (
    <div className="glass-panel p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-400 text-xs font-semibold uppercase">{title}</div>
        <div className={`${color} p-2 rounded-lg bg-opacity-20`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs mt-1 text-slate-500">{note}</div>
    </div>
  );
}