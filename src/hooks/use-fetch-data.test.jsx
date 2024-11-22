import { renderHook, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import useFetchData from "./use-fetch-data";

describe("useFetchData", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("initializes with loading state", () => {
    const { result } = renderHook(() => useFetchData());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(false);
  });

  it("sets data correctly after successful fetch", async () => {
    mock
      .onGet("https://api.worldbank.org/v2/country?format=json&region=EUU")
      .reply(200, [
        null,
        [
          { id: "DEU", name: "Germany" },
          { id: "FRA", name: "France" },
        ],
      ]);
    mock
      .onGet(
        "https://api.worldbank.org/v2/country/DEU/indicator/SP.POP.TOTL?format=json"
      )
      .reply(200, [
        null,
        [
          { date: "2000", value: 82000000, country: { value: "Germany" } },
          { date: "2001", value: 83000000, country: { value: "Germany" } },
        ],
      ]);

    mock
      .onGet(
        "https://api.worldbank.org/v2/country/FRA/indicator/SP.POP.TOTL?format=json"
      )
      .reply(200, [
        null,
        [
          { date: "2000", value: 59000000, country: { value: "France" } },
          { date: "2001", value: 60000000, country: { value: "France" } },
        ],
      ]);

    const { result } = renderHook(() => useFetchData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(false);
    expect(result.current.data).toEqual([
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
    ]);
  });

  it("handles error correctly when fetching country list fails", async () => {
    mock
      .onGet("https://api.worldbank.org/v2/country?format=json&region=EUU")
      .reply(500);

    const { result } = renderHook(() => useFetchData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it("handles error correctly when fetching population data fails", async () => {
    mock
      .onGet(
        "https://api.worldbank.org/v2/country/DEU/indicator/SP.POP.TOTL?format=json"
      )
      .reply(500);

    const { result } = renderHook(() => useFetchData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(true);
    expect(result.current.data).toEqual([]);
  });
});
