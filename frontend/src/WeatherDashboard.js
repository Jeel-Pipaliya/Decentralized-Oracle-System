import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000';

export default function WeatherDashboard() {
  const [weather, setWeather] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const canAggregate = Number(weather?.submissionsCount || 0) >= 3;
  const hasFreshAggregateForPayout =
    Number(weather?.lastAggregatedRound || 0) > Number(insurance?.lastProcessedRound || 0);
  const canCheckPay = hasFreshAggregateForPayout && !insurance?.paid;

  const getFriendlyError = (error) => {
    const raw = error.response?.data?.error || error.message || 'Request failed';

    if (raw.includes('Need minimum 3 submissions')) {
      return 'Aggregation needs at least 3 oracle submissions in the current round.';
    }
    if (raw.includes('No aggregated weather yet')) {
      return 'Run Aggregate Median first, then run Check And Pay.';
    }

    return raw;
  };

  const loadData = async () => {
    setLoading(true);
    setMessage('');

    try {
      const [overviewRes, submissionsRes, nodesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/system/overview`),
        axios.get(`${API_BASE}/api/weather/submissions`),
        axios.get(`${API_BASE}/api/oracle/nodes`),
      ]);

      setWeather(overviewRes.data.weather);
      setInsurance(overviewRes.data.insurance);
      setSubmissions(submissionsRes.data.entries || []);
      setNodes(nodesRes.data.statuses || []);
    } catch (error) {
      setMessage(getFriendlyError(error));
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
      setMessage(getFriendlyError(error));
    }
  };

  const triggerPayoutCheck = async () => {
    try {
      setMessage('Checking payout...');
      await axios.post(`${API_BASE}/api/insurance/check-pay`);
      setMessage('Payout check completed.');
      await loadData();
    } catch (error) {
      setMessage(getFriendlyError(error));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="hero card">
        <h3>Oracle Round Status</h3>
        <p>Track submissions, aggregation, and payout from one screen.</p>
      </div>

      {loading ? <p className="hint">Loading...</p> : null}

      <div className="grid">
        <section className="card">
          <h2>Latest Weather</h2>
          {weather ? (
            <div className="stats">
              <p><span>Temperature</span><strong>{weather.temperature} C</strong></p>
              <p><span>Rainfall</span><strong>{weather.rainfall} mm</strong></p>
              <p><span>Current Round</span><strong>{weather.currentRound}</strong></p>
              <p><span>Last Aggregated Round</span><strong>{weather.lastAggregatedRound}</strong></p>
              <p><span>Current Submissions</span><strong>{weather.submissionsCount}</strong></p>
            </div>
          ) : (
            <p className="hint">No weather data yet.</p>
          )}
        </section>

        <section className="card">
          <h2>Insurance Status</h2>
          {insurance ? (
            <div className="stats">
              <p><span>Paid</span><strong>{insurance.paid ? 'Yes' : 'No'}</strong></p>
              <p><span>Threshold</span><strong>{insurance.thresholdRainfall} mm</strong></p>
              <p><span>Last Processed Round</span><strong>{insurance.lastProcessedRound}</strong></p>
              <p><span>Last Payout</span><strong>{insurance.lastPayoutAmountEth} ETH</strong></p>
            </div>
          ) : (
            <p className="hint">No insurance data yet.</p>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Oracle Nodes</h2>
            <span className="badge">{nodes.length} configured</span>
          </div>
          {nodes.length > 0 ? (
            nodes.map((node, idx) => (
              <div className="response" key={node.nodeAddress}>
                <span>Node {idx + 1}: {node.nodeAddress.slice(0, 8)}...{node.nodeAddress.slice(-4)}</span>
                <strong>{node.authorized ? 'Authorized' : 'Not Authorized'}</strong>
              </div>
            ))
          ) : (
            <p className="hint">No ORACLE_NODE_ADDRESSES configured yet.</p>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Current Round Submissions</h2>
            <span className="badge">{submissions.length} records</span>
          </div>
          {submissions.length > 0 ? (
            submissions.map((entry) => (
              <div className="response" key={entry.index}>
                <span>#{entry.index + 1}</span>
                <span>{entry.temperature} C</span>
                <strong>{entry.rainfall} mm</strong>
              </div>
            ))
          ) : (
            <p className="hint">No submissions in current round.</p>
          )}
        </section>
      </div>

      <div className="actions card">
        <button onClick={loadData}>Refresh</button>
        <button onClick={triggerAggregate} disabled={!canAggregate}>Aggregate Median</button>
        <button onClick={triggerPayoutCheck} disabled={!canCheckPay}>Check And Pay</button>
      </div>

      {message ? <p className="notice">{message}</p> : null}
      <p className="hint">API: {API_BASE}</p>
      
    </div>
  );
}
