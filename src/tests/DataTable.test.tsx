import { render, screen } from "@testing-library/react";
import type { Column } from "../components/DataSection/DataTable/DataTable";
import DataTable from "../components/DataSection/DataTable/DataTable";
 
interface Row {
  id: number;
  name: string;
  age: number;
}

const mockData: Row[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  age: 20 + i,
}));

const columns: Column<Row>[] = [
  { header: "ID", accessor: "id", sortable: true },
  { header: "Name", accessor: "name", sortable: true },
  { header: "Age", accessor: "age" },
];

describe("DataTable", () => {
  it("renders empty state", () => {
    render(<DataTable columns={columns} data={[]} keyField="id" />);
    expect(screen.getByText(/No data available/i)).toBeTruthy();
  });

  it("renders rows", () => {
    render(<DataTable columns={columns} data={mockData} keyField="id" pageSize={5} />);
    expect(screen.getAllByRole("row")).toHaveLength(6); 
  });

 
});
