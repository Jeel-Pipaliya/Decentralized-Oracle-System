import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WeatherDashboard() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Placeholder: frontend will call backend or oracle nodes
  }, []);

  return (
    <div className="dashboard">
      <h2>Latest Weather</h2>
      <pre>{weather ? JSON.stringify(weather, null, 2) : 'No data yet'}</pre>
    </div>
  );
}
