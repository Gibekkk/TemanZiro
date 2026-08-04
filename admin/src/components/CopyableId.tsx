import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyableIdProps {
  value: string;
  /** jumlah karakter yang ditampilkan sebelum "...", default 8 */
  truncateAt?: number;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Menampilkan ID yang dipotong (biar tabel tetap rapi), tapi:
// - hover  -> tooltip nampilin ID lengkap
// - klik   -> copy ID lengkap ke clipboard + feedback "Copied!" sesaat
// ─────────────────────────────────────────────────────────────────────────────
export default function CopyableId({ value, truncateAt = 8, className = '' }: CopyableIdProps) {
  const [copied, setCopied] = useState(false);
  const display = value.length > truncateAt ? `${value.substring(0, truncateAt)}...` : value;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // fallback untuk browser lama / non-secure context
      const el = document.createElement('textarea');
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Tersalin!' : `Klik untuk salin: ${value}`}
      className={`group relative inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors cursor-pointer ${className}`}
    >
      <span>{display}</span>
      {copied ? (
        <Check size={11} className="text-emerald-500 shrink-0" />
      ) : (
        <Copy size={11} className="opacity-0 group-hover:opacity-60 shrink-0 transition-opacity" />
      )}
    </button>
  );
}
