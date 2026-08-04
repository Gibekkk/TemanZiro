import { useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase_config';

// Cache module-level: sekali sebuah uid berhasil di-resolve, tidak perlu
// dipanggil ulang lagi selama sesi admin panel berjalan.
const emailCache = new Map<string, string>();
const inFlight = new Map<string, Promise<void>>();

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const getAuthEmailsCallable = httpsCallable<{ uids: string[] }, { emails: Record<string, string> }>(
  functions,
  'getAuthEmails'
);

/**
 * Resolve email address dari Firebase Auth (bukan field Firestore) untuk
 * sekumpulan uid. Hasil di-cache lintas komponen selama sesi berjalan.
 */
export function useAuthEmails(uids: string[]): { emails: Record<string, string>; loading: boolean } {
  const uidsKey = [...new Set(uids.filter(Boolean))].sort().join(',');
  const [, setTick] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const missing = uidsKey === '' ? [] : uidsKey.split(',').filter((id) => !emailCache.has(id));
    if (missing.length === 0) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      for (const batch of chunk(missing, 100)) {
        const key = batch.join(',');
        if (!inFlight.has(key)) {
          inFlight.set(
            key,
            getAuthEmailsCallable({ uids: batch })
              .then((res) => {
                Object.entries(res.data.emails).forEach(([uid, email]) => emailCache.set(uid, email));
              })
              .catch((err) => {
                console.error('Gagal mengambil email dari Firebase Auth:', err);
              })
              .finally(() => {
                inFlight.delete(key);
              })
          );
        }
        await inFlight.get(key);
      }
      if (!cancelled) {
        setLoading(false);
        setTick((n) => n + 1);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uidsKey]);

  const emails: Record<string, string> = {};
  if (uidsKey !== '') {
    uidsKey.split(',').forEach((id) => {
      const val = emailCache.get(id);
      if (val) emails[id] = val;
    });
  }

  return { emails, loading };
}
