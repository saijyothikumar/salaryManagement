import React from 'react';

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
};

export default function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        Showing <span className="font-semibold">{startItem.toLocaleString()}</span> to{' '}
        <span className="font-semibold">{endItem.toLocaleString()}</span> of{' '}
        <span className="font-semibold">{total.toLocaleString()}</span> employees
      </div>

      <div className="pagination-controls">
        <div className="page-size-selector">
          <label htmlFor="page-size-select" className="filter-label text-xs">Per page:</label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="pagination-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="pagination-buttons">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            className="page-btn"
            title="First Page"
          >
            «
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="page-btn"
          >
            Previous
          </button>

          <span className="page-indicator">
            Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="page-btn"
          >
            Next
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            className="page-btn"
            title="Last Page"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
