import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header.js";
import { Homepage } from "./components/Homepage.js";
import { Settings } from "./components/Settings.js";

function App() {
  const [fetchMetrics, setFetchMetrics] = useState(true);

  return (
    <BrowserRouter>
      <Header fetchMetrics={fetchMetrics} setFetchMetrics={setFetchMetrics}/>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/settings" element={<Settings/>}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
