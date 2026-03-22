import React from 'react';
import WeatherDashboard from './WeatherDashboard';

export default function App() {
  return (
    <div className="App">
      <h1>Weather Oracle</h1>
      <p className="subtitle">Simple, live view of weather and crop insurance payout status.</p>
      <WeatherDashboard />
    </div>
  );
}
