// ─── STUB DATA ────────────────────────────────────────────────────────────
// Semua data pada file ini statis/dummy, hanya untuk preview tampilan.
// Saat backend siap:
//  - DUMMY_REPORTS       -> ganti dengan onSnapshot(collection(db, 'reports'))
//  - DUMMY_CONVERSATIONS -> ganti dengan onSnapshot(collection(db, 'conversations'))
//    + subcollection 'messages' per percakapan
// ────────────────────────────────────────────────────────────────────────────

export type ReportStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type ReportPriority = 'low' | 'medium' | 'high';
export type ReportCategory = 'komplain' | 'pertanyaan' | 'refund' | 'lainnya';

export interface DummyReport {
  id: string; // = booking id, dipakai sebagai nomor laporan
  subject: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  customerName: string;
  companionName: string;
  createdBy: string;
  createdAt: number;
}

export const REPORT_CATEGORY_LABEL: Record<ReportCategory, string> = {
  komplain: 'Komplain',
  pertanyaan: 'Pertanyaan',
  refund: 'Permintaan Refund',
  lainnya: 'Lainnya',
};

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const REPORT_PRIORITY_LABEL: Record<ReportPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const INITIAL_DUMMY_REPORTS: DummyReport[] = [
  {
    id: 'BKG-20260714-001',
    subject: 'Companion tidak hadir sesuai jadwal',
    category: 'komplain',
    description: 'Customer melaporkan companion tidak hadir pada jadwal yang sudah dikonfirmasi tanpa pemberitahuan sebelumnya.',
    status: 'open',
    priority: 'high',
    customerName: 'Siti Rahma',
    companionName: 'Dewi Anggraini',
    createdBy: 'CS - Andini',
    createdAt: Date.parse('2026-07-14T09:20:00+07:00'),
  },
  {
    id: 'BKG-20260712-014',
    subject: 'Permintaan refund — sesi dibatalkan sepihak',
    category: 'refund',
    description: 'Customer meminta refund penuh karena sesi dibatalkan oleh companion satu jam sebelum jadwal.',
    status: 'in_progress',
    priority: 'high',
    customerName: 'Budi Santoso',
    companionName: 'Rina Kusuma',
    createdBy: 'CS - Farhan',
    createdAt: Date.parse('2026-07-12T15:45:00+07:00'),
  },
  {
    id: 'BKG-20260710-007',
    subject: 'Pertanyaan metode pembayaran top up',
    category: 'pertanyaan',
    description: 'Customer menanyakan mengapa saldo belum masuk setelah top up via transfer bank.',
    status: 'resolved',
    priority: 'medium',
    customerName: 'Maya Putri',
    companionName: '-',
    createdBy: 'CS - Andini',
    createdAt: Date.parse('2026-07-10T11:05:00+07:00'),
  },
  {
    id: 'BKG-20260708-022',
    subject: 'Komplain kualitas layanan companion',
    category: 'komplain',
    description: 'Customer merasa companion kurang komunikatif selama sesi berlangsung.',
    status: 'closed',
    priority: 'low',
    customerName: 'Andi Wijaya',
    companionName: 'Putri Lestari',
    createdBy: 'CS - Farhan',
    createdAt: Date.parse('2026-07-08T18:30:00+07:00'),
  },
  {
    id: 'BKG-20260705-003',
    subject: 'Salah input jumlah withdraw',
    category: 'lainnya',
    description: 'Companion melaporkan salah input nominal saat mengajukan withdraw dan minta dibatalkan.',
    status: 'in_progress',
    priority: 'medium',
    customerName: '-',
    companionName: 'Sarah Amelia',
    createdBy: 'CS - Andini',
    createdAt: Date.parse('2026-07-05T08:15:00+07:00'),
  },
  {
    id: 'BKG-20260701-019',
    subject: 'Pertanyaan proses verifikasi akun companion',
    category: 'pertanyaan',
    description: 'Companion baru menanyakan estimasi waktu verifikasi akun.',
    status: 'open',
    priority: 'low',
    customerName: '-',
    companionName: 'Nadia Fitri',
    createdBy: 'CS - Farhan',
    createdAt: Date.parse('2026-07-01T13:00:00+07:00'),
  },
];

// ─── Customer Service ────────────────────────────────────────────────────────

export interface DummyBooking {
  id: string;
  companionName: string;
  customerName: string;
  serviceDate: string;
  amount: number;
  status: 'ongoing' | 'completed' | 'cancelled';
}

export interface DummyChatMessage {
  id: string;
  sender: 'customer' | 'admin';
  text: string;
  time: string;
}

export interface DummyConversation {
  id: string;
  customerName: string;
  lastMessagePreview: string;
  lastMessageTime: string;
  unread: boolean;
  booking: DummyBooking;
  messages: DummyChatMessage[];
}

export const INITIAL_DUMMY_CONVERSATIONS: DummyConversation[] = [
  {
    id: 'conv-1',
    customerName: 'Siti Rahma',
    lastMessagePreview: 'Companion-nya belum datang sampai sekarang...',
    lastMessageTime: '09:18',
    unread: true,
    booking: {
      id: 'BKG-20260714-001',
      companionName: 'Dewi Anggraini',
      customerName: 'Siti Rahma',
      serviceDate: '14 Jul 2026, 09:00',
      amount: 350000,
      status: 'ongoing',
    },
    messages: [
      { id: 'm1', sender: 'customer', text: 'Halo, saya sudah booking companion jam 09:00 tapi sampai sekarang belum ada kabar.', time: '09:05' },
      { id: 'm2', sender: 'admin', text: 'Halo kak Siti, mohon maaf atas ketidaknyamanannya. Saya cek dulu ya status bookingannya.', time: '09:07' },
      { id: 'm3', sender: 'customer', text: 'Companion-nya belum datang sampai sekarang...', time: '09:18' },
    ],
  },
  {
    id: 'conv-2',
    customerName: 'Budi Santoso',
    lastMessagePreview: 'Kapan refund saya diproses ya min?',
    lastMessageTime: 'Kemarin',
    unread: false,
    booking: {
      id: 'BKG-20260712-014',
      companionName: 'Rina Kusuma',
      customerName: 'Budi Santoso',
      serviceDate: '12 Jul 2026, 16:00',
      amount: 500000,
      status: 'cancelled',
    },
    messages: [
      { id: 'm1', sender: 'customer', text: 'Min, sesi saya dibatalkan sepihak sama companion-nya 1 jam sebelum jadwal.', time: '15:10' },
      { id: 'm2', sender: 'admin', text: 'Baik kak, kami sudah catat dan sedang proses pengembalian dana.', time: '15:20' },
      { id: 'm3', sender: 'customer', text: 'Kapan refund saya diproses ya min?', time: '15:45' },
    ],
  },
  {
    id: 'conv-3',
    customerName: 'Maya Putri',
    lastMessagePreview: 'Oke terima kasih min, sudah masuk saldonya',
    lastMessageTime: '2 hari lalu',
    unread: false,
    booking: {
      id: 'BKG-20260710-007',
      companionName: '-',
      customerName: 'Maya Putri',
      serviceDate: '-',
      amount: 200000,
      status: 'completed',
    },
    messages: [
      { id: 'm1', sender: 'customer', text: 'Min, saldo top up saya belum masuk padahal sudah transfer.', time: '10:50' },
      { id: 'm2', sender: 'admin', text: 'Baik kak, mohon ditunggu ya, biasanya maks 15 menit.', time: '10:52' },
      { id: 'm3', sender: 'customer', text: 'Oke terima kasih min, sudah masuk saldonya', time: '11:05' },
    ],
  },
  {
    id: 'conv-4',
    customerName: 'Sarah Amelia',
    lastMessagePreview: 'Tolong dibatalkan withdraw saya min, salah input',
    lastMessageTime: '4 hari lalu',
    unread: true,
    booking: {
      id: 'BKG-20260705-003',
      companionName: 'Sarah Amelia',
      customerName: '-',
      serviceDate: '-',
      amount: 750000,
      status: 'ongoing',
    },
    messages: [
      { id: 'm1', sender: 'customer', text: 'Min, saya salah input nominal withdraw.', time: '08:10' },
      { id: 'm2', sender: 'customer', text: 'Tolong dibatalkan withdraw saya min, salah input', time: '08:15' },
    ],
  },
];
