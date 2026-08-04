import { create } from 'zustand';
import { INITIAL_DUMMY_REPORTS, type DummyReport, type ReportStatus } from '../lib/dummyData';

// ─── STUB STORE ───────────────────────────────────────────────────────────
// In-memory saja (reset saat reload). Saat backend siap, ganti provider ini
// dengan hook yang membaca koleksi Firestore 'reports' secara realtime, dan
// hapus store ini + INITIAL_DUMMY_REPORTS.

interface DummyReportsState {
  reports: DummyReport[];
  addReport: (report: DummyReport) => void;
  updateStatus: (id: string, status: ReportStatus) => void;
}

export const useDummyReportsStore = create<DummyReportsState>((set) => ({
  reports: INITIAL_DUMMY_REPORTS,

  addReport: (report) =>
    set((state) => ({ reports: [report, ...state.reports] })),

  updateStatus: (id, status) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
}));
