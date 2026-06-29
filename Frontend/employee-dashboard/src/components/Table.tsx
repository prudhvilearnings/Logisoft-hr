import React, { useState, useMemo } from 'react';
import { 
  FaSort, FaSortUp, FaSortDown, FaChevronLeft, 
  FaChevronRight, FaSearch, FaFilter, FaInbox 
} from 'react-icons/fa';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: string[];
  filterFn?: (row: T, filterVal: string) => boolean;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
  // Bulk Actions
  bulkActions?: {
    label: string;
    onClick: (selectedRows: T[]) => void;
    className?: string;
  }[];
}

export function Table<T>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  rowKey,
  emptyMessage = 'No records found.',
  bulkActions = [],
}: TableProps<T>) {
  // Sorting State
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Searching State
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering States (column key to active filter value)
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Row Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // Reset page when search or filters change
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handleFilterChange = (columnKey: string, val: string) => {
    setFilters((prev) => {
      const copy = { ...prev };
      if (!val) {
        delete copy[columnKey];
      } else {
        copy[columnKey] = val;
      }
      return copy;
    });
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null); // Reset sorting
      }
    } else {
      setSortKey(columnKey);
      setSortDirection('asc');
    }
  };

  // 1. Filtering & Searching logic
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Apply Search Term
      if (searchTerm && searchKeys.length > 0) {
        const matchesSearch = searchKeys.some((k) => {
          const val = row[k];
          return val != null && String(val).toLowerCase().includes(searchTerm.toLowerCase());
        });
        if (!matchesSearch) return false;
      }

      // Apply Column Filters
      for (const [colKey, filterVal] of Object.entries(filters)) {
        const col = columns.find((c) => c.key === colKey);
        if (col) {
          if (col.filterFn) {
            if (!col.filterFn(row, filterVal)) return false;
          } else {
            // Default exact match filtering
            const val = row[colKey as keyof T];
            if (val != null && String(val) !== filterVal) return false;
          }
        }
      }

      return true;
    });
  }, [data, searchTerm, searchKeys, filters, columns]);

  // 2. Sorting logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    const copy = [...filteredData];
    copy.sort((a, b) => {
      const valA = a[sortKey as keyof T];
      const valB = b[sortKey as keyof T];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return copy;
  }, [filteredData, sortKey, sortDirection]);

  // 3. Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;

  // Selection handlers
  const handleSelectRow = (id: string | number) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const visibleIds = paginatedData.map((row) => rowKey(row));
      setSelectedIds(new Set(visibleIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const isAllSelected = useMemo(() => {
    if (paginatedData.length === 0) return false;
    return paginatedData.every((row) => selectedIds.has(rowKey(row)));
  }, [paginatedData, selectedIds, rowKey]);

  const selectedRowsObjects = useMemo(() => {
    return data.filter((row) => selectedIds.has(rowKey(row)));
  }, [data, selectedIds, rowKey]);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden select-none font-sans">
      
      {/* Header controls (Search, Filters, Selection Bulk Actions) */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Bulk action buttons */}
        <div className="flex items-center space-x-2">
          {selectedIds.size > 0 && bulkActions.length > 0 ? (
            <div className="flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-xl">
              <span className="text-[10px] font-bold text-primary mr-2">{selectedIds.size} selected</span>
              {bulkActions.map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    act.onClick(selectedRowsObjects);
                    setSelectedIds(new Set());
                  }}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer ${
                    act.className || 'bg-primary text-white hover:bg-primary-hover shadow-sm'
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>
          ) : (
            searchKeys.length > 0 && (
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FaSearch className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-250 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-primary transition"
                />
              </div>
            )
          )}
        </div>

        {/* Filters and page-size toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {columns.filter((c) => c.filterable && c.filterOptions).map((col) => (
            <div key={col.key} className="flex items-center space-x-1.5 relative">
              <FaFilter className="w-2.5 h-2.5 text-slate-400" />
              <select
                value={filters[col.key] || ''}
                onChange={(e) => handleFilterChange(col.key, e.target.value)}
                className="bg-white border border-slate-250 rounded-xl text-[10px] font-bold text-slate-650 py-1 px-2 focus:outline-none focus:border-primary transition outline-none"
              >
                <option value="">All {col.header}s</option>
                {col.filterOptions?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Page size controller */}
          <div className="text-[10px] font-semibold text-slate-400 flex items-center space-x-1">
            <span>Size:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-250 rounded-xl text-[10px] font-bold text-slate-600 py-1 px-1.5 focus:outline-none transition"
            >
              {[5, 10, 20, 50].map((sz) => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Table grid container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50/50">
              {/* Check all checkbox */}
              {bulkActions.length > 0 && (
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="h-3.5 w-3.5 bg-slate-50 border-slate-300 text-primary focus:ring-primary rounded cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`py-3 px-4 ${
                      col.sortable ? 'cursor-pointer hover:bg-slate-100 select-none' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-350">
                          {isSorted ? (
                            sortDirection === 'asc' ? <FaSortUp className="w-2.5 h-2.5 text-primary" /> : <FaSortDown className="w-2.5 h-2.5 text-primary" />
                          ) : (
                            <FaSort className="w-2.5 h-2.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
            {isLoading ? (
              // Skeletal loading indicators
              Array.from({ length: pageSize }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {bulkActions.length > 0 && <td className="py-3 px-4"><div className="h-4 bg-slate-100 rounded animate-pulse w-4"></div></td>}
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-4">
                      <div className="h-3.5 bg-slate-150 rounded animate-pulse w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FaInbox className="w-8 h-8 text-slate-300" />
                    <span className="text-xs font-semibold">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              // Content rows
              paginatedData.map((row) => {
                const key = rowKey(row);
                const isSelected = selectedIds.has(key);
                return (
                  <tr 
                    key={key} 
                    className={`hover:bg-slate-50/40 transition duration-100 ${
                      isSelected ? 'bg-primary/5' : ''
                    }`}
                  >
                    {bulkActions.length > 0 && (
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(key)}
                          className="h-3.5 w-3.5 bg-slate-50 border-slate-300 text-primary focus:ring-primary rounded cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="py-3 px-4 whitespace-nowrap">
                        {col.render ? col.render(row) : String(row[col.key as keyof T] || '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-400">
        <div>
          {sortedData.length > 0 ? (
            <span>
              Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} to{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
            </span>
          ) : (
            <span>No entries to display</span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || isLoading}
            className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded-xl transition text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            aria-label="Previous Page"
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>
          
          <div className="flex items-center space-x-1 px-2 text-slate-800">
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || isLoading}
            className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded-xl transition text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            aria-label="Next Page"
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
}
