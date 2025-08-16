import React, { useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa";
import type { CellTower, FilterProps } from "../../../types";
import "./SmFilters.scss";

interface SmFiltersProps {
  data: CellTower[];
  filters: FilterProps["filters"];
  cities: string[];
  onFiltersChange: {
    setSearchTerm: (term: string) => void;
    setSelectedCity: (city: string) => void;
    setSortConfig?: (config: { key: keyof CellTower; direction: "asc" | "desc" } | null) => void;
  };
  onClearFilters: () => void;
  onRowClick?: (row: CellTower) => void;
  pageSize?: number;
  sortConfig?: { key: keyof CellTower; direction: "asc" | "desc" } | null;
}

const SmFilters: React.FC<SmFiltersProps> = ({
  filters,
  cities,
  onFiltersChange,
  onClearFilters,
  sortConfig,
}) => {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"filters" | "sort">("filters");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onFiltersChange.setSearchTerm(e.target.value);
 

 
  const handleClearAll = () => {
    onClearFilters();
    if (onFiltersChange.setSortConfig) {
      onFiltersChange.setSortConfig(null);
    }
  };

  return (
    <div>
      {/* Toggle Buttons */}
      <div className="bottom-sheet-toggle">
        <button
          className="button"
          onClick={() => {
            setActiveTab("filters");
            setBottomSheetOpen(true);
          }}
        >
          Filters <FaFilter />
        </button>
        <button
          className="button"
          onClick={() => {
            setActiveTab("sort");
            setBottomSheetOpen(true);
          }}
        >
          Sort <FaSort />
        </button>
      </div>

      {/* Bottom Sheet */}
      {bottomSheetOpen && (
        <div className="bottom-sheet-overlay" onClick={() => setBottomSheetOpen(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-header">
              <h3>{activeTab === "filters" ? "Filters" : "Sort"}</h3>
              <button className="close-btn" onClick={() => setBottomSheetOpen(false)}>
                ×
              </button>
            </div>



            <div className="bottom-sheet-body">
              {/* Filters Tab */}
              {activeTab === "filters" && (
                <div className="filters">
                  <div className="filter-group">
                    <label>Search</label>
                    <input
                      type="text"
                      placeholder="Search towers..."
                      value={filters.searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>

                  <div className="filter-group">
                    <label>City</label>
                    {cities.map((city) => (
                      <label key={city} className="filter-radio">
                        <input
                          type="radio"
                          name="city"
                          value={city}
                          checked={filters.selectedCity === city}
                          onChange={() => onFiltersChange.setSelectedCity(city)}
                        />
                        <span>{city}</span>
                      </label>
                    ))}
                    <label className="filter-radio">
                      <input
                        type="radio"
                        name="city"
                        value=""
                        checked={filters.selectedCity === ""}
                        onChange={() => onFiltersChange.setSelectedCity("")}
                      />
                      <span>All Cities</span>
                    </label>
                  </div>

                  <button
                    className="clear-filters"
                    onClick={handleClearAll}
                    disabled={!filters.searchTerm && !filters.selectedCity && !sortConfig}
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Sort Tab */}
              {/* Sort Tab */}
              {activeTab === "sort" && (
                <div className="sort">
                  <div className="sort-list">
                    {[
                      { key: "name", label: "Name" },
                      { key: "city", label: "City" },
                      { key: "networkType", label: "Network Type" },
                      { key: "signalStrength", label: "Signal Strength" },
                      { key: "status", label: "Status" },
                    ].map((item) => {
                      const isActive = sortConfig?.key === item.key;
                      const direction = isActive ? sortConfig?.direction || "asc" : "asc";

                      return (
                        <div
                          key={item.key}
                          className={`sort-item ${isActive ? "active" : ""}`}
                          onClick={() =>
                            onFiltersChange.setSortConfig?.({
                              key: item.key as keyof CellTower,
                              direction: isActive && direction === "asc" ? "desc" : "asc",
                            })
                          }
                        >
                          <span>{item.label} {isActive && (
                            <span className="sort-direction">
                              {direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}</span>
                         
                          {isActive && (
                            <span
                              className="close-sort"
                              onClick={(e) => {
                                e.stopPropagation();
                                onFiltersChange.setSortConfig?.(null);
                              }}
                            >
                              ×
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmFilters;