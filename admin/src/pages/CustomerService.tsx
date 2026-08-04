import { useMemo, useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useDummyReportsStore } from '../store/dummyReportsStore';
import {
  INITIAL_DUMMY_CONVERSATIONS,
  type DummyConversation,
  type DummyChatMessage,
  type ReportCategory,
  type ReportPriority,
  REPORT_CATEGORY_LABEL,
} from '../lib/dummyData';
import { Search, Send, X, Info, Calendar, Wallet, User2, Ticket } from 'lucide-react';

const BOOKING_STATUS_LABEL: Record<string, string> = {
  ongoing: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const BOOKING_STATUS_PILL: Record<string, string> = {
  ongoing: 'bg-sky-500/15 text-sky-500',
  completed: 'bg-emerald-500/15 text-emerald-500',
  cancelled: 'bg-red-500/15 text-red-500',
};

// ─── Create Ticket Modal ─────────────────────────────────────────────────────
function CreateTicketModal({
  conversation, onClose, onCreated,
}: {
  conversation: DummyConversation;
  onClose: () => void;
  onCreated: (ticketId: string) => void;
}) {
  const addReport = useDummyReportsStore((s) => s.addReport);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<ReportCategory>('komplain');
  const [priority, setPriority] = useState<ReportPriority>('medium');
  const [description, setDescription] = useState('');

  const canSubmit = subject.trim() !== '' && description.trim() !== '';

  const handleSubmit = () => {
    if (!canSubmit) return;
    addReport({
      id: conversation.booking.id,
      subject: subject.trim(),
      category,
      description: description.trim(),
      status: 'open',
      priority,
      customerName: conversation.booking.customerName,
      companionName: conversation.booking.companionName,
      createdBy: 'CS - Anda',
      createdAt: Date.now(),
    });
    onCreated(conversation.booking.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-2xl p-6 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg">Buat Tiket Laporan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="rounded-xl bg-gray-50 dark:bg-white/5 px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs text-slate-400">Nomor Laporan (dari Booking ID)</span>
          <span className="font-mono text-sm text-slate-800 dark:text-white">{conversation.booking.id}</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Judul</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ringkasan singkat masalah..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReportCategory)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
              >
                {(Object.keys(REPORT_CATEGORY_LABEL) as ReportCategory[]).map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-800">
                    {REPORT_CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReportPriority)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
              >
                <option value="low" className="bg-white dark:bg-slate-800">Low</option>
                <option value="medium" className="bg-white dark:bg-slate-800">Medium</option>
                <option value="high" className="bg-white dark:bg-slate-800">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan detail laporan berdasarkan percakapan..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500 resize-none transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2 rounded-xl text-sm font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Buat Tiket
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CustomerService() {
  const { isVerifikasiOrAbove } = useAuth();
  const existingReports = useDummyReportsStore((s) => s.reports);

  const [conversations, setConversations] = useState<DummyConversation[]>(INITIAL_DUMMY_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_DUMMY_CONVERSATIONS[0]?.id ?? null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showStubNote, setShowStubNote] = useState(true);

  // Hanya admin_level 2 (verifikasi) & 3 (owner) yang boleh mengakses.
  if (!isVerifikasiOrAbove) {
    return <Navigate to="/" replace />;
  }

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.customerName.toLowerCase().includes(q));
  }, [conversations, search]);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;
  const alreadyHasTicket = selected ? existingReports.some((r) => r.id === selected.booking.id) : false;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || draft.trim() === '') return;
    const newMsg: DummyChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'admin',
      text: draft.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessagePreview: newMsg.text, lastMessageTime: newMsg.time }
          : c
      )
    );
    setDraft('');
  };

  const handleTicketCreated = (ticketId: string) => {
    setShowTicketModal(false);
    setToast(`Tiket ${ticketId} berhasil dibuat. Lihat di tab Laporan.`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6 z-10 relative">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        Customer Service
      </h2>

      {showStubNote && (
        <div className="flex items-start gap-3 rounded-xl bg-sky-500/10 border border-sky-500/20 px-4 py-3">
          <Info size={16} className="text-sky-500 mt-0.5 flex-shrink-0" />
          <p className="text-sky-600 dark:text-sky-400 text-sm flex-1">
            Halaman ini masih memakai data dummy untuk preview tampilan — chat & percakapan belum tersambung
            ke Firestore realtime.
          </p>
          <button onClick={() => setShowStubNote(false)} className="text-sky-500/60 hover:text-sky-500 text-lg leading-none">×</button>
        </div>
      )}

      <div className="glass-panel rounded-2xl overflow-hidden h-[72vh] flex">
        {/* Conversation list */}
        <div className="w-72 flex-shrink-0 border-r border-gray-200 dark:border-white/5 flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-white/5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari percakapan..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8">Tidak ada percakapan.</p>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === selectedId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelect(conv.id)}
                    className={`w-full text-left px-3 py-3 border-b border-gray-100 dark:border-white/5 transition-colors flex gap-3 items-start ${
                      isActive ? 'bg-primary-500/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {conv.customerName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{conv.customerName}</p>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{conv.lastMessagePreview}</p>
                    </div>
                    {conv.unread && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {selected ? (
            <>
              <div className="px-4 py-3 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">{selected.customerName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{selected.booking.id}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selected.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                        m.sender === 'admin'
                          ? 'bg-primary-500 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.sender === 'admin' ? 'text-white/70' : 'text-slate-400'}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="p-3 border-t border-gray-200 dark:border-white/5 flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ketik balasan..."
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={draft.trim() === ''}
                  className="p-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Pilih percakapan untuk mulai chat.
            </div>
          )}
        </div>

        {/* Booking detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 border-l border-gray-200 dark:border-white/5 p-4 overflow-y-auto hidden lg:flex lg:flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Detail Bookingan</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Ticket size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="font-mono text-slate-800 dark:text-white">{selected.booking.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User2 size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{selected.booking.companionName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{selected.booking.serviceDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-mono">
                    Rp {selected.booking.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${BOOKING_STATUS_PILL[selected.booking.status]}`}>
                  {BOOKING_STATUS_LABEL[selected.booking.status]}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/5">
              <button
                onClick={() => setShowTicketModal(true)}
                disabled={alreadyHasTicket}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Ticket size={15} />
                {alreadyHasTicket ? 'Tiket Sudah Dibuat' : 'Buat Tiket Laporan'}
              </button>
              {alreadyHasTicket && (
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Lihat tiket ini di tab Laporan.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {showTicketModal && selected && (
        <CreateTicketModal
          conversation={selected}
          onClose={() => setShowTicketModal(false)}
          onCreated={handleTicketCreated}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-2xl border border-white/10 max-w-xs">
          {toast}
        </div>
      )}
    </div>
  );
}
