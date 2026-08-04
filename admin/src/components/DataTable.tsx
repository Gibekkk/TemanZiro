import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Omit to make the column non-sortable. */
  sortValue?: (row: T) => string | number | boolean | null | undefined;
  /** Omit to exclude the column from the global search box. */
  searchValue?: (row: T) => string;
  align?: 'left' | 'center' | 'right';
  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  rowClassName?: (row: T) => string;
}

type SortState = { id: string; dir: 'asc' | 'desc' } | null;

function alignClass(align?: 'left' | 'center' | 'right') {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
}

function justifyClass(align?: 'left' | 'center' | 'right') {
  if (align === 'center') return 'justify-center';
  if (align === 'right') return 'justify-end';
  return 'justify-start';
}

export default function DataTable<T,>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = 'Tidak ada data.',
  searchPlaceholder = 'Cari...',
  pageSize = 10,
  rowClassName,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(0);

  const hasSearch = columns.some((c) => c.searchValue);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      columns.some((col) => {
        if (!col.searchValue) return false;
        return String(col.searchValue(row) ?? '').toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.id === sort.id);
    if (!col?.sortValue) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'string' && typeof vb === 'string') {
        return sort.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      if (va < vb) return sort.dir === 'asc' ? -1 : 1;
      if (va > vb) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sort, columns]);

  useEffect(() => {
    setPage(0);
  }, [search, sort, data.length]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const clampedPage = Math.min(page, totalPages - 1);
  const pageRows = sorted.slice(clampedPage * pageSize, clampedPage * pageSize + pageSize);

  const toggleSort = (colId: string) => {
    setSort((prev) => {
      if (!prev || prev.id !== colId) return { id: colId, dir: 'asc' };
      if (prev.dir === 'asc') return { id: colId, dir: 'desc' };
      return null;
    });
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      {hasSearch && (
        <div className="px-4 pt-4">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 dark:border-white/5">
            <tr className="h-10 text-xs uppercase text-slate-500">
              {columns.map((col) => (
                <th
                  key={col.id}
                  onClick={col.sortValue ? () => toggleSort(col.id) : undefined}
                  className={`px-4 py-2 font-medium ${alignClass(col.align)} ${
                    col.sortValue ? 'cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-300' : ''
                  } ${col.headerClassName ?? ''}`}
                >
                  <span className={`inline-flex items-center gap-1 w-full ${justifyClass(col.align)}`}>
                    {col.header}
                    {col.sortValue && (
                      sort?.id === col.id ? (
                        sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      ) : (
                        <ChevronsUpDown size={12} className="opacity-30" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="text-xs">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  {data.length === 0 ? emptyMessage : 'Tidak ada hasil yang cocok dengan pencarian.'}
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={
                    rowClassName
                      ? rowClassName(row)
                      : 'h-12 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors'
                  }
                >
                  {columns.map((col) => (
                    <td key={col.id} className={`px-4 py-2 ${alignClass(col.align)} ${col.cellClassName ?? ''}`}>
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && sorted.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-white/5 text-xs text-slate-500">
          <span>
            {clampedPage * pageSize + 1}–{Math.min(sorted.length, (clampedPage + 1) * pageSize)} dari {sorted.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={clampedPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Prev
            </button>
            <span>{clampedPage + 1} / {totalPages}</span>
            <button
              disabled={clampedPage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
