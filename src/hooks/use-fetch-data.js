import { useEffect, useState } from "react";
import axios from "axios";

const useFetchData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCountryListData = async () => {
    try {
      const response = await axios.get(
        "https://api.worldbank.org/v2/country?format=json&region=EUU"
      );
      const countries = response.data[1];
      return countries.map((country) => country.id);
    } catch (error) {
      console.error("Error fetching country list:", error);
      throw error;
    }
  };

  const fetchPopulationByCountryData = async (countryIds) => {
    try {
      const populationPromises = countryIds.map(async (countryId) => {
        const response = await axios.get(
          `https://api.worldbank.org/v2/country/${countryId}/indicator/SP.POP.TOTL?format=json`
        );
        const countryData = response.data[1];
        if (!countryData) return null;

        return {
          country: countryData[0].country.value,
          population: countryData.map((entry) => ({
            x: entry.date,
            y: entry.value,
          })),
        };
      });

      const populationData = await Promise.all(populationPromises);
      return populationData.filter(Boolean);
    } catch (error) {
      console.error("Error fetching population data:", error);
      throw error;
    }
  };

  const fetchAndSetData = async () => {
    try {
      const countryIds = await fetchCountryListData();
      const populationData = await fetchPopulationByCountryData(countryIds);
      setData(populationData);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetData();
  }, []);

  return { data, loading, error };
};

export default useFetchData;
