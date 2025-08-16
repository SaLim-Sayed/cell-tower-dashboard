import React, { useState } from "react";
import type { CellTower } from "../../types/dashboard.types";
import StarRatings from "react-star-ratings";
import "./DataCards.scss";

interface DataCardsProps {
  data: CellTower[];
  onRowClick?: (row: CellTower) => void;
  pageSize?: number;
}

const DataCards: React.FC<DataCardsProps> = ({ data, onRowClick, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CellTower; direction: "asc" | "desc" } | null>(null);

  // Apply sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return [...data];
    return [...data].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentData = sortedData.slice(startIdx, startIdx + pageSize);

  if (data.length === 0) {
    return <div className="data-cards__empty">No data available</div>;
  }

  return (
    <div>
      {/* Sort Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button onClick={() => setSortModalOpen(true)}>Sort</button>
      </div>

      {/* Modal */}
      {sortModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Sort Options</h3>
            <select
              onChange={(e) =>
                setSortConfig((prev) => ({
                  key: e.target.value as keyof CellTower,
                  direction: prev?.direction || "asc",
                }))
              }
              value={sortConfig?.key || ""}
            >
              <option value="">-- Select Field --</option>
              <option value="name">Name</option>
              <option value="city">City</option>
              <option value="networkType">Network Type</option>
              <option value="signalStrength">Signal Strength</option>
              <option value="status">Status</option>
            </select>

            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() =>
                  setSortConfig((prev) =>
                    prev ? { ...prev, direction: "asc" } : { key: "name", direction: "asc" }
                  )
                }
                className={sortConfig?.direction === "asc" ? "active" : ""}
              >
                Ascending
              </button>
              <button
                onClick={() =>
                  setSortConfig((prev) =>
                    prev ? { ...prev, direction: "desc" } : { key: "name", direction: "desc" }
                  )
                }
                className={sortConfig?.direction === "desc" ? "active" : ""}
              >
                Descending
              </button>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <button onClick={() => setSortModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Data Cards */}
      <div className="data-cards">
        {currentData.map((tower) => (
          <div
            key={tower.id}
            className="data-card"
            onClick={() => onRowClick?.(tower)}
          >
            <div className="card-header">
              <h3>{tower.name}</h3>
              <span className={`dashboard__status dashboard__status--${tower.status.toLowerCase()}`}>
                {tower.status}
              </span>
            </div>

            <div className="card-body">
              <div className="card-field">
                <strong>City</strong>
                <span>{tower.city}</span>
              </div>
              <div className="card-field">
                <strong>Network Type</strong>
                <span>{tower.networkType}</span>
              </div>
              <div className="card-field flex items-center gap-2">
                <strong>Signal Strength</strong>
                <StarRatings
                  rating={tower.signalStrength}
                  starRatedColor="gold"
                  numberOfStars={5}
                  starDimension="16px"
                  starSpacing="2px"
                  name={`signal-${tower.id}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataCards;
