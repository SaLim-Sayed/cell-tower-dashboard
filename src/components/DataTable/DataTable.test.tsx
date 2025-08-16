import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTable from './DataTable';

describe('DataTable Component', () => {
  // Sample data for testing
  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Status', accessor: 'status' },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <button onClick={() => console.log(`Edit ${row.id}`)}>Edit</button>
      )
    },
  ];

  const data = [
    { id: 1, name: 'Tower A', status: 'Active' },
    { id: 2, name: 'Tower B', status: 'Inactive' },
    { id: 3, name: 'Tower C', status: 'Maintenance' },
  ];

  it('renders the table with correct headers', () => {
    render(<DataTable columns={columns} data={data} keyField="id" />);
    
    // Check if all headers are rendered
    columns.forEach(column => {
      expect(screen.getByText(column.header)).toBeInTheDocument();
    });
    
    // Check if the correct number of rows are rendered (data rows + header)
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(data.length + 1); // +1 for header row
  });

  it('sorts data when sortable column header is clicked', () => {
    render(<DataTable columns={columns} data={data} keyField="id" />);
    
    // Click on the 'Name' column header to sort
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    
    // Get all name cells after sorting
    const nameCells = screen.getAllByRole('cell', { name: /Tower [A-Z]/ });
    
    // Check if data is sorted in ascending order
    expect(nameCells[0]).toHaveTextContent('Tower A');
    expect(nameCells[1]).toHaveTextContent('Tower B');
    
    // Click again to sort in descending order
    fireEvent.click(nameHeader);
    
    // Get name cells again after second click
    const nameCellsDesc = screen.getAllByRole('cell', { name: /Tower [A-Z]/ });
    
    // Check if data is sorted in descending order
    expect(nameCellsDesc[0]).toHaveTextContent('Tower C');
    expect(nameCellsDesc[1]).toHaveTextContent('Tower B');
  });

  it('handles row selection when selectable is true', () => {
    const handleSelectionChange = jest.fn();
    
    render(
      <DataTable 
        columns={columns} 
        data={data} 
        keyField="id" 
        selectable
        onSelectionChange={handleSelectionChange}
      />
    );
    
    // Select the first row
    const firstCheckbox = screen.getAllByRole('checkbox')[1]; // First checkbox is select all
    fireEvent.click(firstCheckbox);
    
    // Check if the selection change callback was called with the correct data
    expect(handleSelectionChange).toHaveBeenCalledWith([data[0]]);
    
    // Select all rows using the header checkbox
    const selectAllCheckbox = screen.getByLabelText('Select all rows');
    fireEvent.click(selectAllCheckbox);
    
    // Check if all rows are selected
    expect(handleSelectionChange).toHaveBeenLastCalledWith(expect.arrayContaining(data));
  });

  it('handles pagination when pageSize is set', () => {
    const pageSize = 2;
    render(
      <DataTable 
        columns={columns} 
        data={data} 
        keyField="id" 
        pageSize={pageSize}
      />
    );
    
    // Check if only the first page of data is shown
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(pageSize + 1); // +1 for header row
    
    // Check if pagination controls are rendered
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    
    // Go to next page
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    // Check if page number updated
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  it('calls onRowClick when a row is clicked', () => {
    const handleRowClick = jest.fn();
    
    render(
      <DataTable 
        columns={columns} 
        data={data} 
        keyField="id" 
        onRowClick={handleRowClick}
      />
    );
    
    // Click on the first data row
    const firstDataRow = screen.getAllByRole('row')[1]; // First row is header
    fireEvent.click(firstDataRow);
    
    // Check if the callback was called with the correct data
    expect(handleRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('shows loading state when loading prop is true', () => {
    render(
      <DataTable 
        columns={columns} 
        data={[]} 
        keyField="id" 
        loading
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty state when there is no data', () => {
    render(
      <DataTable 
        columns={columns} 
        data={[]} 
        keyField="id" 
        emptyState={<div>No towers found</div>}
      />
    );
    
    expect(screen.getByText('No towers found')).toBeInTheDocument();
  });
});
