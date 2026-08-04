import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

/**
 * getAuthEmails
 * -------------
 * Admin panel tidak boleh menyimpan/mengandalkan email hasil copy di Firestore.
 * Function ini membaca email langsung dari Firebase Auth berdasarkan uid,
 * hanya untuk pemanggil yang statusnya admin (admin_level >= 1 pada
 * profile_companion/{uid}).
 *
 * Input : { uids: string[] }   (maks 100 per panggilan)
 * Output: { emails: Record<uid, email> }
 */
export const getAuthEmails = onCall(async (request) => {
  const callerUid = request.auth?.uid;
  if (!callerUid) {
    throw new HttpsError("unauthenticated", "Anda harus login.");
  }

  const profileSnap = await getFirestore().doc(`profile_companion/${callerUid}`).get();
  const adminLevel = profileSnap.exists ? Number(profileSnap.data()?.admin_level ?? 0) : 0;
  if (!(adminLevel >= 1)) {
    throw new HttpsError("permission-denied", "Akun ini bukan admin.");
  }

  const rawUids = request.data?.uids;
  if (!Array.isArray(rawUids) || rawUids.length === 0) {
    throw new HttpsError("invalid-argument", "uids harus berupa array non-kosong.");
  }

  const uids = [...new Set(rawUids.filter((u): u is string => typeof u === "string" && u.length > 0))].slice(0, 100);

  const result = await getAuth().getUsers(uids.map((uid) => ({ uid })));

  const emails: Record<string, string> = {};
  for (const user of result.users) {
    if (user.email) emails[user.uid] = user.email;
  }

  return { emails };
});
