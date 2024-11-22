import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PopulationChart from "./chart";
import useFetchData from "../hooks/use-fetch-data";
import { vi } from "vitest";

vi.mock("react-chartjs-2", () => ({
  Bar: ({ data }) => <div data-testid="chart-mock">{JSON.stringify(data)}</div>,
}));

vi.mock("../hooks/use-fetch-data");

const mockData = [
  {
    country: "Germany",
    population: [
      { x: "2000", y: 82000000 },
      { x: "2001", y: 83000000 },
    ],
  },
  {
    country: "France",
    population: [
      { x: "2000", y: 59000000 },
      { x: "2001", y: 60000000 },
    ],
  },
];

describe("PopulationChart", () => {
  it("renders loading spinner while fetching data", () => {
    useFetchData.mockReturnValue({
      data: [],
      loading: true,
      error: false,
    });

    render(<PopulationChart />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("displays an error message if fetching fails", () => {
    useFetchData.mockReturnValue({
      data: [],
      loading: false,
      error: true,
    });

    render(<PopulationChart />);

    expect(
      screen.getByText(/Sorry, something went wrong/i)
    ).toBeInTheDocument();
  });

  it("renders chart with all countries' data by default", () => {
    useFetchData.mockReturnValue({
      data: mockData,
      loading: false,
      error: false,
    });

    render(<PopulationChart />);

    expect(screen.getByTestId("chart-mock")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Germany" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "France" })).toBeInTheDocument();
  });

  it("updates chart data when a specific country is selected", () => {
    useFetchData.mockReturnValue({
      data: mockData,
      loading: false,
      error: false,
    });

    render(<PopulationChart />);

    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Germany" }));

    const chartMock = screen.getByTestId("chart-mock");

    const chartData = JSON.parse(chartMock.textContent);

    expect(chartData.labels).toEqual(["2001", "2000"]);
    expect(chartData.datasets[0].data).toEqual([83000000, 82000000]);
  });

  it("resets chart data when 'All' is selected", () => {
    useFetchData.mockReturnValue({
      data: mockData,
      loading: false,
      error: false,
    });

    render(<PopulationChart />);

    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "Germany" }));

    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "All" }));

    const chartMock = screen.getByTestId("chart-mock");
    const chartData = JSON.parse(chartMock.textContent);

    expect(chartData.labels).toEqual(["Germany", "France"]);
    expect(chartData.datasets[0].data).toEqual([
      mockData[0].population[0].y,
      mockData[1].population[0].y,
    ]);
  });
});
