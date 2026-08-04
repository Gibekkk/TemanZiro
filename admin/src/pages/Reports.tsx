import { useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useDummyReportsStore } from '../store/dummyReportsStore';
import {
  REPORT_CATEGORY_LABEL,
  REPORT_PRIORITY_LABEL,
  type DummyReport,
  type ReportStatus,
} from '../lib/dummyData';
import { format } from 'date-fns';
import { X, Info } from 'lucide-react';
import DataTable, { type DataTableColumn } from '../components/DataTable';

const STATUS_OPTIONS: ReportStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

const STATUS_PILL: Record<ReportStatus, string> = {
  open: 'bg-sky-500/15 text-sky-500',
  in_progress: 'bg-amber-500/15 text-amber-500',
  resolved: 'bg-emerald-500/15 text-emerald-500',
  closed: 'bg-slate-500/15 text-slate-500',
};

const PRIORITY_PILL: Record<string, string> = {
  low: 'bg-slate-500/15 text-slate-400',
  medium: 'bg-amber-500/15 text-amber-500',
  high: 'bg-red-500/15 text-red-500',
};

function DetailModal({ report, onClose }: { report: DummyReport; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-2xl p-6 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg">Detail Laporan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Nomor Laporan</p>
            <p className="font-mono text-slate-800 dark:text-white">{report.id}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Judul</p>
            <p className="text-slate-800 dark:text-white font-medium">{report.subject}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Deskripsi</p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{report.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Customer</p>
              <p className="text-slate-800 dark:text-white">{report.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Companion</p>
              <p className="text-slate-800 dark:text-white">{report.companionName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Dibuat oleh</p>
              <p className="text-slate-800 dark:text-white">{report.createdBy}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Tanggal</p>
              <p className="text-slate-800 dark:text-white">{format(new Date(report.createdAt), 'dd MMM yyyy, HH:mm')}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export default function Reports() {
  const { isVerifikasiOrAbove } = useAuth();
  const reports = useDummyReportsStore((s) => s.reports);
  const updateStatus = useDummyReportsStore((s) => s.updateStatus);
  const [detailTarget, setDetailTarget] = useState<DummyReport | null>(null);
  const [showStubNote, setShowStubNote] = useState(true);

  // Hanya admin_level 2 (verifikasi) & 3 (owner) yang boleh mengakses.
  if (!isVerifikasiOrAbove) {
    return <Navigate to="/" replace />;
  }

  const columns: DataTableColumn<DummyReport>[] = [
    {
      id: 'id',
      header: 'Nomor Laporan',
      sortValue: (r) => r.id,
      searchValue: (r) => r.id,
      cell: (r) => <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{r.id}</span>,
    },
    {
      id: 'subject',
      header: 'Judul',
      sortValue: (r) => r.subject.toLowerCase(),
      searchValue: (r) => `${r.subject} ${r.description}`,
      cell: (r) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{r.subject}</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-0.5">
            {REPORT_CATEGORY_LABEL[r.category]}
          </p>
        </div>
      ),
    },
    {
      id: 'related',
      header: 'Terkait',
      searchValue: (r) => `${r.customerName} ${r.companionName}`,
      cell: (r) => (
        <div className="text-xs">
          <p className="text-slate-700 dark:text-slate-300">👤 {r.customerName}</p>
          <p className="text-slate-500 dark:text-slate-400">💬 {r.companionName}</p>
        </div>
      ),
    },
    {
      id: 'priority',
      header: 'Prioritas',
      align: 'center',
      sortValue: (r) => ({ low: 0, medium: 1, high: 2 }[r.priority]),
      cell: (r) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PRIORITY_PILL[r.priority]}`}>
          {REPORT_PRIORITY_LABEL[r.priority]}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      align: 'center',
      sortValue: (r) => r.status,
      cell: (r) => (
        <select
          value={r.status}
          onChange={(e) => updateStatus(r.id, e.target.value as ReportStatus)}
          className={`appearance-none cursor-pointer px-2.5 py-1 rounded-full text-xs font-medium border-none focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${STATUS_PILL[r.status]}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
      ),
    },
    {
      id: 'date',
      header: 'Tanggal',
      sortValue: (r) => r.createdAt,
      cell: (r) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs">
          {format(new Date(r.createdAt), 'dd MMM yyyy')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      align: 'right',
      cell: (r) => (
        <button
          onClick={() => setDetailTarget(r)}
          className="text-primary-500 hover:text-primary-600 text-xs font-semibold uppercase tracking-wide transition-colors"
        >
          Detail
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 z-10 relative">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        Laporan
      </h2>

      {showStubNote && (
        <div className="flex items-start gap-3 rounded-xl bg-sky-500/10 border border-sky-500/20 px-4 py-3">
          <Info size={16} className="text-sky-500 mt-0.5 flex-shrink-0" />
          <p className="text-sky-600 dark:text-sky-400 text-sm flex-1">
            Halaman ini masih memakai data dummy untuk preview tampilan. Tiket baru dari Customer Service
            juga akan muncul di sini (in-memory, reset saat reload) — belum tersambung ke Firestore.
          </p>
          <button onClick={() => setShowStubNote(false)} className="text-sky-500/60 hover:text-sky-500 text-lg leading-none">×</button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={reports}
        rowKey={(r) => r.id}
        emptyMessage="Belum ada laporan."
        searchPlaceholder="Cari nomor laporan, judul, atau nama..."
      />

      {detailTarget && (
        <DetailModal report={detailTarget} onClose={() => setDetailTarget(null)} />
      )}
    </div>
  );
}
