import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as Chartjs } from "chart.js/auto";
import useFetchData from "../hooks/use-fetch-data";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

function PopulationChart() {
  const { data, loading, error } = useFetchData();
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [chartData, setChartData] = useState([]);

  const transformData = (countriesData) => {
    return countriesData.map((country) => ({
      x: country.country,
      y: country.population[0]?.y || 0,
    }));
  };

  useEffect(() => {
    if (data.length > 0) {
      setChartData(transformData(data));
    }
  }, [data]);

  if (loading)
    return (
      <CircularProgress
        size={100}
        color="white"
        id="loading-spinner"
        className="loading-spinner"
      />
    );
  if (error) return <p>Sorry, something went wrong. Please try again.</p>;

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);

    if (country === "all") {
      setChartData(transformData(data));
    } else {
      const selectedCountryData = data.find((item) => item.country === country);
      if (selectedCountryData) {
        setChartData(selectedCountryData.population.reverse());
      }
    }
  };

  return (
    <div className="page-content">
      <FormControl className="drop-down">
        <InputLabel id="country-select-label">Country</InputLabel>
        <Select
          id="country-select"
          labelId="country-select-label"
          value={selectedCountry}
          label="Country"
          onChange={handleCountryChange}
          data-testid="country-select"
          aria-label="country"
        >
          <MenuItem value="all">All</MenuItem>
          {data.map((country, index) => (
            <MenuItem key={index} value={country.country}>
              {country.country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="bar-chart">
        <Bar
          data={{
            labels: chartData.map((entry) => entry.x),
            datasets: [
              {
                label: "Population",
                data: chartData.map((entry) => entry.y),
                backgroundColor: "#e56b6f",
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

export default PopulationChart;
