import { useEffect, useMemo, useState } from "react";

const randomOffset = (range) => Math.round((Math.random() - 0.5) * range * 2);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const buildPath = (data, width, height, min = 70, max = 98) => {
  const step = width / (data.length - 1 || 1);
  return data
    .map((value, index) => {
      const x = index * step;
      const normalized = (value - min) / (max - min);
      const y = height - normalized * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
};

const createHistory = (base, jitter) =>
  Array.from({ length: 24 }, () => base + randomOffset(jitter));

export default function App() {
  const [nodeStats, setNodeStats] = useState([
    { name: "Node1", trust: 91, latency: 190, uptime: 98, status: "Online" },
    { name: "Node2", trust: 86, latency: 215, uptime: 96, status: "Online" },
    { name: "Node3", trust: 74, latency: 320, uptime: 92, status: "Degraded" },
  ]);

  const [apiStatus, setApiStatus] = useState([
    { name: "OpenWeatherMap", status: "Healthy", latency: 190, requests: 1420, updated: 12 },
    { name: "Node1 Feed", status: "Healthy", latency: 210, requests: 860, updated: 18 },
    { name: "Node2 Feed", status: "Healthy", latency: 235, requests: 790, updated: 22 },
    { name: "Node3 Feed", status: "Delayed", latency: 320, requests: 610, updated: 45 },
  ]);

  const [consensus, setConsensus] = useState({ temp: 27.1, rain: 9.6, humidity: 68 });
  const [pulse, setPulse] = useState({ confidence: 92, outliers: 3, lastAgg: 32 });
  const [medianInputs, setMedianInputs] = useState({ node1: 28, node2: 30, node3: 47 });
  const [history, setHistory] = useState({
    node1: createHistory(88, 4),
    node2: createHistory(84, 4),
    node3: createHistory(76, 5),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setNodeStats((prev) =>
        prev.map((node) => ({
          ...node,
          trust: clamp(node.trust + randomOffset(4), 70, 98),
          latency: clamp(node.latency + randomOffset(30), 150, 360),
          uptime: clamp(node.uptime + randomOffset(2), 90, 100),
        }))
      );

      setApiStatus((prev) =>
        prev.map((api) => {
          const roll = Math.random();
          const status = roll > 0.94 ? "Down" : roll > 0.82 ? "Delayed" : "Healthy";
          return {
            ...api,
            status,
            latency: clamp(api.latency + randomOffset(40), 160, 420),
            requests: clamp(api.requests + randomOffset(120), 520, 1600),
            updated: clamp(api.updated + randomOffset(12), 6, 60),
          };
        })
      );

      setConsensus({
        temp: Number((25 + Math.random() * 4).toFixed(1)),
        rain: Number((6 + Math.random() * 8).toFixed(1)),
        humidity: clamp(Math.round(55 + Math.random() * 25), 50, 85),
      });

      setPulse({
        confidence: clamp(92 + randomOffset(4), 84, 99),
        outliers: clamp(3 + randomOffset(2), 1, 6),
        lastAgg: clamp(32 + randomOffset(10), 12, 60),
      });

      setHistory((prev) => ({
        node1: [...prev.node1.slice(1), clamp(prev.node1.at(-1) + randomOffset(3), 72, 98)],
        node2: [...prev.node2.slice(1), clamp(prev.node2.at(-1) + randomOffset(3), 70, 96)],
        node3: [...prev.node3.slice(1), clamp(prev.node3.at(-1) + randomOffset(4), 68, 92)],
      }));
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const medianValues = Object.values(medianInputs);
  const sortedValues = [...medianValues].sort((a, b) => a - b);
  const medianValue = median(medianValues);

  const chartPaths = useMemo(() => {
    return {
      node1: buildPath(history.node1, 320, 140),
      node2: buildPath(history.node2, 320, 140),
      node3: buildPath(history.node3, 320, 140),
    };
  }, [history]);

  return (
    <div className="app">
      <div className="bg-noise" aria-hidden="true"></div>
      <header className="site-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true"></div>
          <div className="brand-text">
            <span className="brand-name">Weather Oracle</span>
            <span className="brand-tag">Decentralized weather oracle improvement system</span>
          </div>
        </div>
        <nav className="nav-links">
          <a href="#overview">Overview</a>
          <a href="#status">API Status</a>
          <a href="#median">Median Lab</a>
          <a href="#pulse">Network Pulse</a>
          <a href="#workflow">Workflow</a>
          <a href="#dashboard">Dashboard</a>
        </nav>
        <button className="ghost-button">Docs</button>
      </header>

      <main>
        <section className="hero" id="overview">
          <div className="hero-copy">
            <p className="eyebrow">Real-world weather data for smart contracts</p>
            <h1>Median-validated weather data you can trust.</h1>
            <p className="hero-body">
              A decentralized weather oracle network that pulls data from multiple nodes, filters
              outliers using median aggregation, and stores the final trusted result on-chain for
              apps like crop insurance.
            </p>
            <div className="hero-actions">
              <button className="primary-button">View Live Status</button>
              <button className="ghost-button">Explore Workflow</button>
            </div>
            <div className="hero-metrics">
              <div className="metric">
                <span className="metric-value">3</span>
                <span className="metric-label">Oracle nodes</span>
              </div>
              <div className="metric">
                <span className="metric-value">5</span>
                <span className="metric-label">Use cases covered</span>
              </div>
              <div className="metric">
                <span className="metric-value">1</span>
                <span className="metric-label">Median aggregation</span>
              </div>
            </div>
          </div>
          <div className="hero-panel">
            <div className="panel-header">
              <span className="panel-title">Median Output</span>
              <span className="panel-chip">Outlier-safe</span>
            </div>
            <div className="panel-body">
              <div className="panel-row">
                <span>Temperature (C)</span>
                <strong>{consensus.temp}</strong>
              </div>
              <div className="panel-row">
                <span>Rainfall (mm)</span>
                <strong>{consensus.rain}</strong>
              </div>
              <div className="panel-row">
                <span>Humidity</span>
                <strong>{consensus.humidity}%</strong>
              </div>
              <div className="panel-divider"></div>
              <div className="panel-note">
                Median aggregation removes fake or extreme submissions before the trusted weather
                result is stored on-chain.
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="status">
          <div className="section-header">
            <h2>Real-time API status</h2>
            <p>Monitor live feeds from OpenWeatherMap and internal oracle nodes.</p>
          </div>
          <div className="grid-4">
            {apiStatus.map((api) => (
              <article className="card api-card" key={api.name}>
                <div className="api-header">
                  <h3>{api.name}</h3>
                  <span
                    className={`status ${
                      api.status === "Healthy" ? "online" : api.status === "Delayed" ? "warning" : "danger"
                    }`}
                  >
                    {api.status}
                  </span>
                </div>
                <div className="api-metric">
                  <span>Latency</span>
                  <strong>{api.latency} ms</strong>
                </div>
                <div className="api-metric">
                  <span>Requests</span>
                  <strong>{api.requests.toLocaleString()} / hr</strong>
                </div>
                <div className="api-metric">
                  <span>Last update</span>
                  <strong>{api.updated} sec ago</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="median">
          <div className="section-header">
            <h2>Interactive median lab</h2>
            <p>Adjust node submissions to see how median aggregation filters outliers.</p>
          </div>
          <div className="grid-2">
            <div className="card median-card">
              {[
                { key: "node1", label: "Node1 temperature" },
                { key: "node2", label: "Node2 temperature" },
                { key: "node3", label: "Node3 temperature" },
              ].map((item) => (
                <div className="median-row" key={item.key}>
                  <label htmlFor={`${item.key}-range`}>{item.label}</label>
                  <input
                    id={`${item.key}-range`}
                    type="range"
                    min={20}
                    max={item.key === "node3" ? 60 : 40}
                    value={medianInputs[item.key]}
                    onChange={(event) =>
                      setMedianInputs((prev) => ({
                        ...prev,
                        [item.key]: Number(event.target.value),
                      }))
                    }
                  />
                  <span>{medianInputs[item.key]} C</span>
                </div>
              ))}
              <div className="median-foot">
                <span>Sorted values</span>
                <strong>{sortedValues.join(", ")}</strong>
              </div>
            </div>
            <div className="card median-result">
              <h3>Median output</h3>
              <p className="median-value">{medianValue} C</p>
              <p className="panel-note">
                Extreme values are ignored, keeping the final result stable for smart contract
                consumption.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="pulse">
          <div className="section-header">
            <h2>Network pulse</h2>
            <p>Live history of node trust scores and median confidence.</p>
          </div>
          <div className="grid-2">
            <div className="card chart-card">
              <div className="chart-header">
                <h3>Trust score trend</h3>
                <span className="panel-chip">Last 24 cycles</span>
              </div>
              <svg className="chart" viewBox="0 0 320 140" aria-hidden="true">
                <path className="chart-line line-a" d={chartPaths.node1}></path>
                <path className="chart-line line-b" d={chartPaths.node2}></path>
                <path className="chart-line line-c" d={chartPaths.node3}></path>
              </svg>
              <div className="chart-legend">
                <span>
                  <i className="legend-dot dot-a"></i>Node1
                </span>
                <span>
                  <i className="legend-dot dot-b"></i>Node2
                </span>
                <span>
                  <i className="legend-dot dot-c"></i>Node3
                </span>
              </div>
            </div>
            <div className="card pulse-card">
              <h3>Median confidence</h3>
              <div className="pulse-metric">
                <span>Consensus stability</span>
                <strong>{pulse.confidence}%</strong>
              </div>
              <div className="pulse-metric">
                <span>Outliers filtered</span>
                <strong>{pulse.outliers}</strong>
              </div>
              <div className="pulse-metric">
                <span>Last aggregation</span>
                <strong>{pulse.lastAgg} sec ago</strong>
              </div>
              <div className="pulse-bar">
                <div className="bar" style={{ width: `${pulse.confidence}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="workflow">
          <div className="section-header">
            <h2>System workflow</h2>
            <p>From OpenWeatherMap data to on-chain delivery.</p>
          </div>
          <div className="flow animated-flow">
            {[
              {
                title: "Fetch data",
                detail: "Oracle nodes pull temperature and rainfall from the API.",
              },
              {
                title: "Submit values",
                detail: "Each node submits its data to the smart contract.",
              },
              {
                title: "Aggregate",
                detail: "Owner triggers the median aggregation function.",
              },
              {
                title: "Consume",
                detail: "Crop insurance contract reads weather and triggers payouts.",
              },
            ].map((step, index) => (
              <div className="flow-step" key={step.title}>
                <span className="flow-index">0{index + 1}</span>
                <h4>{step.title}</h4>
                <p>{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="dashboard">
          <div className="section-header">
            <h2>Live node dashboard</h2>
            <p>Node performance, availability, and latency snapshot.</p>
          </div>
          <div className="grid-3">
            {nodeStats.map((node) => (
              <article className="card node-card" key={node.name}>
                <div className="node-header">
                  <h3>{node.name}</h3>
                  <span className={`status ${node.status === "Online" ? "online" : "warning"}`}>
                    {node.status}
                  </span>
                </div>
                <div className="node-metric">
                  <span>Trust score</span>
                  <strong>{node.trust}</strong>
                </div>
                <div className="node-metric">
                  <span>Latency</span>
                  <strong>{node.latency} ms</strong>
                </div>
                <div className="node-metric">
                  <span>Availability</span>
                  <strong>{node.uptime}%</strong>
                </div>
                <div className="node-bar">
                  <div className="bar" style={{ width: `${node.trust}%` }}></div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>Decentralized Weather Oracle</strong>
          <p>Trusted weather data for crop insurance and smart agriculture.</p>
        </div>
        <div className="footer-links">
          <a href="#overview">Overview</a>
          <a href="#workflow">Workflow</a>
          <a href="#dashboard">Dashboard</a>
        </div>
      </footer>
    </div>
  );
}
