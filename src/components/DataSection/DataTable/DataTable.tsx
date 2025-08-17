/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import './DataTable.scss';
import { FaArrowLeft, FaArrowRight, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: keyof T;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  priority?: 'high' | 'medium' | 'low'; // For responsive column hiding
  mobileLabel?: string; // Custom label for mobile stacked view
  render?: (row: T) => React.ReactNode; // optional custom rendering

}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  pageSize?: number;
  loading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
  responsive?: 'adaptive' | 'stack' | 'scroll'; // Responsive behavior
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  keyField,
  onRowClick,
  selectable = false,
  onSelectionChange,
  pageSize = 10,
  loading = false,
  emptyState,
  className = '',
  responsive = 'adaptive',
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [isMobileView, setIsMobileView] = useState(false);

  const visibleColumns = useMemo(() => {
    if (responsive !== 'adaptive') return columns;

    return columns.filter(col => {
      if (!isMobileView) return true;
      return !col.priority || col.priority === 'high';
    });
  }, [columns, responsive, isMobileView]);

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };


  const handleRowSelect = (e: React.ChangeEvent<HTMLInputElement>, row: T) => {
    e.stopPropagation();
    const newSelectedRows = new Set(selectedRows);
    const rowKey = row[keyField];

    if (e.target.checked) {
      newSelectedRows.add(rowKey);
    } else {
      newSelectedRows.delete(rowKey);
    }

    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      const selectedData = data.filter((item) =>
        newSelectedRows.has(item[keyField])
      );
      onSelectionChange(selectedData);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedRows = e.target.checked
      ? new Set(paginatedData.map((row) => row[keyField]))
      : new Set();

    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      const selectedData = e.target.checked ? [...paginatedData] : [];
      onSelectionChange(selectedData);
    }
  };

  const renderCellContent = (row: T, column: Column<T>) => {
    if (column.render) {
      return column.render(row);
    }
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor as keyof T];
  };

  // Render stacked mobile view
  const renderStackedView = () => (
    <div className="data-table__stacked">
      {paginatedData.map((row) => (
        <div
          key={row[keyField]}
          className={`data-table__card ${onRowClick ? 'clickable' : ''}`}
          onClick={() => onRowClick?.(row)}
        >
          {selectable && (
            <div className="data-table__card-select">
              <input
                type="checkbox"
                checked={selectedRows.has(row[keyField])}
                onChange={(e) => handleRowSelect(e, row)}
                aria-label={`Select row ${row[keyField]}`}
              />
            </div>
          )}
          {columns.map((column) => (
            <div key={`${row[keyField]}-${column.header}`} className="data-table__card-field">
              <div className="data-table__card-label">
                {column.mobileLabel || column.header}
              </div>
              <div className="data-table__card-value">
                {column.render ? column.render(row) : renderCellContent(row, column)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  // Check if we should use mobile view based on responsive setting
  React.useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    if (responsive === 'adaptive' || responsive === 'stack') {
      checkMobileView();
      window.addEventListener('resize', checkMobileView);
      return () => window.removeEventListener('resize', checkMobileView);
    }
  }, [responsive]);

  if (loading) {
    return (
      <div className={`data-table loading ${className}`}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`data-table empty ${className}`}>
        {emptyState || <div className="empty-state">No data available</div>}
      </div>
    );
  }

  const shouldUseStackedView = responsive === 'stack' && isMobileView;

  return (
    <div className={`data-table data-table--${responsive} ${className}`}>
      {shouldUseStackedView ? (
        renderStackedView()
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {selectable && (
                  <th className="select-column">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((row) =>
                          selectedRows.has(row[keyField])
                        )
                      }
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {visibleColumns.map((column) => {
                  const sortKey = column.sortKey || (typeof column.accessor === "string" ? column.accessor : null);

                  return (
                    <th
                      key={column.header}
                      style={{
                        width: column.width,
                        textAlign: column.align || "left",
                      }}
                      className={`${column.sortable ? "sortable" : ""} ${sortConfig.key === sortKey ? `sorted-${sortConfig.direction}` : ""
                        }`}
                      onClick={() => column.sortable && sortKey && handleSort(sortKey)}
                    >
                      {column.header}
                      {column.sortable && (
                        <span className="sort-icon">
                          {sortConfig.key === sortKey ? (
                            sortConfig.direction === "asc" ? <FaSortUp   /> : <FaSortDown style={{ transform: "rotate(180deg)" }} />
                          ) : (
                            <FaSort />
                          )}
                        </span>
                      )}
                    </th>
                  );
                })}

              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr
                  key={row[keyField]}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'clickable' : ''}
                >
                  {selectable && (
                    <td className="select-cell">
                      <input
                        type="checkbox"
                        
                        checked={selectedRows.has(row[keyField])}
                        onChange={(e) => handleRowSelect(e, row)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select row ${row[keyField]}`}
                      />
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td
                      key={`${row[keyField]}-${column.header}`}
                      style={{ textAlign: column.align || 'left' ,color:'#000'}}
                    >
                      {renderCellContent(row, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination__button"
          >
            <FaArrowLeft /> Previous
          </button>
          <span className="pagination__info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            style={{color:'#000'}}
          >
            Next <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;