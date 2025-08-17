import { fireEvent, render, screen } from "@testing-library/react";
import DataCards from "../components/DataSection/DataCards/DataCards";
import type { CellTower } from "../types";
 

const mockData: CellTower[] = Array.from({ length: 15 }, (_, i) => ({
  id: `tower-${i + 1}`,
  name: `Tower ${i + 1}`,
  status: i % 2 === 0 ? "active" : "offline",
  city: `City ${i + 1}`,
  networkType: i % 2 === 0 ? "4G" : "5G",
  signalStrength: (i % 5) + 1,
}));

describe("DataCards Component", () => {
  it("renders empty state when no data", () => {
    render(<DataCards data={[]} />);
    expect(screen.getByText("No data available")).toBeTruthy();
  });

  it("renders a list of data cards (first page only)", () => {
    render(<DataCards data={mockData} pageSize={5} />);

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
    expect(screen.getByText("Tower 1")).toBeTruthy();
    expect(screen.getByText("Tower 5")).toBeTruthy();
    expect(screen.queryByText("Tower 6")).not.toBeTruthy();
  });

  it("calls onRowClick when a card is clicked", () => {
    const handleClick = jest.fn();
    render(<DataCards data={mockData} onRowClick={handleClick} pageSize={5} />);

    const card = screen.getByText("Tower 1");
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledWith(mockData[0]);
  });

  it("navigates to next page when clicking Next", () => {
    render(<DataCards data={mockData} pageSize={5} />);

    expect(screen.getByText("Tower 1")).toBeTruthy();
    expect(screen.queryByText("Tower 6")).not.toBeTruthy();

    fireEvent.click(screen.getByText(/Next/i));

    expect(screen.getByText("Tower 6")).toBeTruthy();
    expect(screen.getByText("Tower 6")).toBeTruthy();
    expect(screen.queryByText("Tower 1")).not.toBeTruthy();
  });

});
