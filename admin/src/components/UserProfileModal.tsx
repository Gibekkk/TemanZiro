import { useEffect, useState } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase_config';
import { useAuthEmails } from '../hooks/useAuthEmails';
import { X, Mail, Wallet, ArrowRight, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

function toDate(val: number | Timestamp | Date | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date(val);
}

function parseBalance(val: string | number | undefined | null): number {
  if (val === undefined || val === null || val === '') return 0;
  const parsed = parseInt(String(val).replace(/\D/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
}

function formatRp(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`;
}

type ProfileKind = 'user' | 'companion';

interface UserProfileModalProps {
  uid: string;
  kind: ProfileKind;
  onClose: () => void;
  /** nominal request yang sedang diproses (top up / withdraw), untuk simulasi */
  simulateAmount?: number;
  /** +1 = saldo bertambah (top up), -1 = saldo berkurang (withdraw) */
  simulateDirection?: 1 | -1;
  /** label kartu simulasi, mis. "Jika top up disetujui" */
  simulateLabel?: string;
}

const KIND_CONFIG: Record<ProfileKind, {
  collection: string;
  nameFields: string[];
  balanceField: string;
  joinedField: string;
}> = {
  user: {
    collection: 'profile_user',
    nameFields: ['name_user', 'name'],
    balanceField: 'balance_user',
    joinedField: 'createdAt',
  },
  companion: {
    collection: 'profile_companion',
    nameFields: ['name_companion', 'name'],
    balanceField: 'balance',
    joinedField: 'createdAt',
  },
};

export default function UserProfileModal({
  uid, kind, onClose, simulateAmount, simulateDirection = 1, simulateLabel,
}: UserProfileModalProps) {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const config = KIND_CONFIG[kind];

  const { emails } = useAuthEmails([uid]);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      doc(db, config.collection, uid),
      (snap) => {
        setProfile(snap.exists() ? snap.data() : null);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [uid, config.collection]);

  const name = config.nameFields.map((f) => profile?.[f]).find(Boolean) ?? '—';
  const authEmail = emails[uid];
  const email = authEmail ?? profile?.email ?? null;
  const currentBalance = parseBalance(profile?.[config.balanceField]);
  const joined = toDate(profile?.[config.joinedField]);

  const hasSimulation = typeof simulateAmount === 'number' && simulateAmount > 0;
  const simulatedBalance = hasSimulation
    ? Math.max(0, currentBalance + simulateDirection * (simulateAmount as number))
    : null;

  const handleCopyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op — clipboard tidak tersedia
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md glass-panel bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg">
            {kind === 'user' ? 'Profil User' : 'Profil Companion'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-400 text-sm">Memuat profil...</div>
        ) : !profile ? (
          <div className="py-10 text-center text-slate-400 text-sm">Data tidak ditemukan.</div>
        ) : (
          <>
            {/* Header identitas */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-500/15 text-primary-500 flex items-center justify-center font-bold text-lg shrink-0">
                {String(name).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{name}</p>
                {joined && (
                  <p className="text-xs text-slate-400">Bergabung {format(joined, 'dd MMM yyyy')}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail size={15} className="text-slate-400 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                  {email ?? 'Email tidak tersedia'}
                </span>
              </div>
              {email && (
                <button
                  onClick={handleCopyEmail}
                  title="Salin email"
                  className="text-slate-400 hover:text-primary-500 transition-colors shrink-0"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              )}
            </div>

            {/* Balance */}
            <div className="rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-semibold tracking-wide">
                <Wallet size={13} />
                Balance Saat Ini
              </div>
              <p className="text-xl font-bold font-mono text-green-600 dark:text-green-400">
                {formatRp(currentBalance)}
              </p>
            </div>

            {/* Simulasi */}
            {hasSimulation && simulatedBalance !== null && (
              <div className="rounded-xl bg-primary-500/10 border border-primary-500/20 px-4 py-3 space-y-2">
                <p className="text-xs text-primary-500 font-semibold uppercase tracking-wide">
                  {simulateLabel ?? (simulateDirection > 0 ? 'Jika request disetujui' : 'Jika request disetujui')}
                </p>
                <div className="flex items-center gap-2 font-mono text-sm flex-wrap">
                  <span className="text-slate-500 dark:text-slate-400">{formatRp(currentBalance)}</span>
                  <ArrowRight size={14} className="text-slate-400 shrink-0" />
                  <span className={`font-bold ${simulateDirection > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {formatRp(simulatedBalance)}
                  </span>
                  <span className={`text-xs ${simulateDirection > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    ({simulateDirection > 0 ? '+' : '-'}{formatRp(simulateAmount as number)})
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
