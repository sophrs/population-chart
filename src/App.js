import React from "react";
import "./index.css";
import PopulationChart from "./components/chart";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Population Data</p>
      </header>
      <PopulationChart />
    </div>
  );
}

export default App;
