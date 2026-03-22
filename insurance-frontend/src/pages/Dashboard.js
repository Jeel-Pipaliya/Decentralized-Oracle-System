import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

export default function Dashboard() {
  const [account, setAccount] = useState("");
  const [insurance, setInsurance] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadLiveData();
    const timer = setInterval(loadLiveData, 7000);
    return () => clearInterval(timer);
  }, []);

  async function loadLiveData() {
    try {
      const [weatherRes, insuranceRes] = await Promise.all([
        axios.get(`${API_BASE}/api/weather/final`),
        axios.get(`${API_BASE}/api/insurance/status`),
      ]);
      setWeather(weatherRes.data);
      setInsurance(insuranceRes.data);
    } catch (err) {
      setNotice(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      setNotice("Install MetaMask to connect wallet.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setNotice("Wallet connected (read-only)");
      }
    } catch (err) {
      setNotice(err.message);
    }
  }

  return (
    <div className="dashboard-page">
      <Navbar account={account} onConnect={connectWallet} />

      <div className="hero card" style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h2>Crop Insurance Portal</h2>
        <p style={{ color: "#aaa" }}>Automated payouts executed by the Decentralized Weather Oracle.</p>
      </div>

      <div className="grid">
        <section className="card">
          <h3>Coverage & Policy</h3>
          <p style={{ color: "#bbb", marginBottom: "1rem" }}>Status of the latest drought protection policy.</p>
          {insurance ? (
            <div className="stats" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ padding: "15px", borderRadius: "8px", border: `2px solid ${insurance.paid ? '#4CAF50' : '#FFC107'}` }}>
                <span style={{ fontSize: "14px", color: "#ccc" }}>Active Status</span>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: insurance.paid ? '#4CAF50' : '#FFC107' }}>
                  {insurance.paid ? 'PAID OUT ✅' : 'ACTIVE COVERAGE ☂️'}
                </div>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "8px" }}>
                <span style={{ fontSize: "14px", color: "#ccc" }}>Trigger Threshold</span>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>Under {insurance.thresholdRainfall} mm of rain</div>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "8px" }}>
                <span style={{ fontSize: "14px", color: "#ccc" }}>Vault Balance</span>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>{insurance.balanceEth} ETH</div>
              </div>
            </div>
          ) : (
            <p className="hint">Loading insurance data...</p>
          )}
        </section>

        <section className="card">
          <h3>Oracle Live Data</h3>
          <p style={{ color: "#bbb", marginBottom: "1rem" }}>Verified real-world data driving the contract.</p>
          {weather ? (
            <div className="stats" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "8px" }}>
                <span style={{ fontSize: "14px", color: "#ccc" }}>Current Median Rainfall</span>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#64B5F6" }}>
                  {weather.rainfall} mm
                </div>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "8px" }}>
                <span style={{ fontSize: "14px", color: "#ccc" }}>Temperature</span>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>{weather.temperature} °C</div>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "8px" }}>
                <span style={{ fontSize: "14px", color: "#ccc" }}>Blockchain Round</span>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>Round #{weather.currentRound}</div>
              </div>
            </div>
          ) : (
            <p className="hint">Loading weather data...</p>
          )}
        </section>
      </div>

      {notice && (
        <p className="notice" style={{ marginTop: '20px', color: '#ffb3b3', textAlign: 'center' }}>
          {notice}
        </p>
      )}
    </div>
  );
}
