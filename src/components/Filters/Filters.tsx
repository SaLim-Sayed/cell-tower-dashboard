import React from 'react';
import type { FilterProps } from '../../types/dashboard';
import './Filters.scss';
import { TbTrash } from 'react-icons/tb';

const Filters: React.FC<FilterProps & {
  onFiltersChange: { setSearchTerm: (term: string) => void; setSelectedCity: (city: string) => void };
  onClearFilters: () => void;
}> = ({ filters, cities, onFiltersChange, onClearFilters, className = '', testId }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange.setSearchTerm(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange.setSelectedCity(e.target.value);
  };

  return (
    <div className={`filters-container ${className}`} data-testid={testId}>
      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            className="filter-search"
            placeholder="Search towers..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">City</label>
          <select
            className="filter-select"
            value={filters.selectedCity}
            onChange={handleCityChange}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">-</label>

          <button
            className="clear-filters"
            onClick={onClearFilters}
            disabled={!filters.searchTerm && !filters.selectedCity}
          >
            Clear Filters
            <TbTrash size={20} />
          </button>
        </div>
      </div>


    </div>
  );
};

export default Filters;
