import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Header from "../components/Header/Header";

describe("Header component", () => {
  it("renders with default props", () => {
    render(<Header />);

    expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();
    expect(screen.getByText("Cell Tower Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toBeTruthy();

    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Signal")).toBeInTheDocument();
    expect(screen.getByText("0/5")).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <Header
        title="My Towers"
        totalTowers={12}
        activeTowers={9}
        avgSignal={4.2}
        className="custom-class"
        testId="custom-header"
      />
    );

    const header = screen.getByTestId("custom-header");
    expect(header).toHaveClass("header custom-class");

    expect(screen.getByText("My Towers")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("4.2/5")).toBeInTheDocument();
  });

  it("renders logo image", () => {
    render(<Header />);
    const logo = screen.getByRole("img");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", expect.stringContaining("antenna.svg"));
  });
});
