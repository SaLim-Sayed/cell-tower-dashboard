import React, { useState } from "react";
import type { CellTower } from "../../../types/dashboard";
import StarRatings from "react-star-ratings";
import "./DataCards.scss";

interface DataCardsProps {
  data: CellTower[];
  onRowClick?: (row: CellTower) => void;
  pageSize?: number;
}

const DataCards: React.FC<DataCardsProps> = ({ data, onRowClick, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIdx, startIdx + pageSize);

  if (data.length === 0) {
    return <div className="data-cards__empty">No data available</div>;
  }

  return (
    <div>
      

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
