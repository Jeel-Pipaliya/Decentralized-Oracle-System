import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css"; // Ensure styles are linked

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("Idle"); // Running / Error / Idle
  const [lastTx, setLastTx] = useState("None");
  const [lastUpdated, setLastUpdated] = useState("Never");

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  async function fetchData() {
    try {
      setStatus("Running");
      const [weatherRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE}/api/weather/final`),
        axios.get(`${API_BASE}/api/oracle/history`)
      ]);

      setWeather(weatherRes.data);
      const logs = historyRes.data || [];
      setHistory(logs);

      if (logs.length > 0) {
        setLastTx(logs[0].txHash);
        // Approximation of time based on when we fetched it, or just use current time
        setLastUpdated(new Date().toLocaleTimeString());
      }
      setStatus("Idle");
    } catch (err) {
      console.error(err);
      setStatus("Error");
    }
  }

  // Determine status color
  const statusColor = status === "Error" ? "#ff4d4f" : status === "Running" ? "#52c41a" : "#1890ff";

  return (
    <div className="oracle-dashboard">
      <header className="oracle-header">
        <h1>Weather Oracle Monitor</h1>
        <div className="status-indicator">
          <span className="dot" style={{ backgroundColor: statusColor }}></span>
          <span>{status}</span>
        </div>
      </header>

      <main className="oracle-content">
        <div className="cards-grid">
          <div className="card stat-card">
            <h3>Median Temperature</h3>
            <div className="stat-value">{weather?.temperature ?? "--"} °C</div>
          </div>
          
          <div className="card stat-card">
            <h3>Median Rainfall</h3>
            <div className="stat-value">{weather?.rainfall ?? "--"} mm</div>
          </div>

          <div className="card stat-card">
            <h3>Last Updated</h3>
            <div className="stat-value" style={{ fontSize: "1.2rem", marginTop: "1rem" }}>{lastUpdated}</div>
          </div>
          
          <div className="card stat-card">
            <h3>Last Transaction Hash</h3>
            <div className="stat-value hash-value">
              {lastTx !== "None" ? `${lastTx.substring(0, 10)}...${lastTx.substring(lastTx.length - 8)}` : "None"}
            </div>
          </div>
        </div>

        <div className="card logs-card">
          <h2>Logs & History</h2>
          <div className="logs-container">
            {history.length > 0 ? (
              history.slice(0, 20).map((log, i) => (
                <div key={i} className="log-entry">
                  <span className="log-time">[Block {log.blockNumber}]</span>
                  <span className="log-type" style={{ color: log.type === 'WeatherAggregated' ? '#e2b3ff' : '#69b1ff' }}>
                    {log.type}
                  </span>
                  <span className="log-details">
                    {log.type === "WeatherSubmitted" 
                      ? `Node ${log.node.substring(0,6)}... submitted Temp: ${log.temperature}°C, Rain: ${log.rainfall}mm`
                      : `Aggregated Round ${log.round} - Temp: ${log.temperature}°C, Rain: ${log.rainfall}mm`}
                  </span>
                  <span className="log-tx">TX: {log.txHash.substring(0,10)}...</span>
                </div>
              ))
            ) : (
              <div className="log-empty">No history logs to display yet.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
