import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000';

export default function WeatherDashboard() {
  const [weather, setWeather] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    setMessage('');

    try {
      const [weatherRes, insuranceRes] = await Promise.all([
        axios.get(`${API_BASE}/api/weather/final`),
        axios.get(`${API_BASE}/api/insurance/status`),
      ]);

      setWeather(weatherRes.data);
      setInsurance(insuranceRes.data);
    } catch (error) {
      setMessage(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerAggregate = async () => {
    try {
      setMessage('Aggregating...');
      await axios.post(`${API_BASE}/api/weather/aggregate`);
      setMessage('Aggregation successful.');
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Weather Oracle Admin</h1>
      {loading ? <p className="hint">Loading...</p> : null}

      <div className="cards">
        <section className="card">
          <h2>Latest On-Chain Weather</h2>
          {weather ? (
            <div className="stats">
              <p><span>Temperature</span><strong>{weather.temperature} C</strong></p>
              <p><span>Rainfall</span><strong>{weather.rainfall} mm</strong></p>
              <p><span>Round</span><strong>{weather.currentRound}</strong></p>
            </div>
          ) : (
            <p className="hint">No weather data yet.</p>
          )}
        </section>
      </div>

      <div className="actions">
        <button onClick={loadData}>Refresh</button>
        <button onClick={triggerAggregate}>Aggregate Median</button>
      </div>

      {message ? <p className="hint">{message}</p> : null}
      <div className="api-base">API: {API_BASE}</div>
      
    </div>
  );
}
