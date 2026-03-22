import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import RequestCard from "../components/RequestCard";
import ResponseList from "../components/ResponseList";
import Leaderboard from "../components/Leaderboard";
import { getContract } from "../utils/contract";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";
const localOracleAddrs = [
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
];

export default function Dashboard() {
  const [account, setAccount] = useState("");
  const [responses, setResponses] = useState([]);
  const [oracles, setOracles] = useState([]);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latestWeather, setLatestWeather] = useState(null);
  const [notice, setNotice] = useState("");

  const median = useMemo(() => {
    if (!responses.length) return null;
    const values = responses.map((r) => r.rainfall).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  }, [responses]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const timer = setInterval(loadLiveData, 7000);
    return () => clearInterval(timer);
  }, [contract]);

  async function init() {
    await loadLiveData();
    if (window.ethereum) {
      try {
        const c = await getContract();
        setContract(c);
        const signer = await c.runner.getAddress();
        setAccount(signer);
      } catch (err) {
        setNotice(err.message);
      }
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      setNotice("Install MetaMask to connect wallet.");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const c = await getContract();
      setContract(c);
      const signer = await c.runner.getAddress();
      setAccount(signer);
      setNotice("Wallet connected");
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function getOnchainResponses(c) {
    if (!c) return [];
    const list = [];

    for (let i = 0; i < 12; i += 1) {
      try {
        const item = await c.submissions(i);
        list.push({
          node: `Node ${i + 1}`,
          rainfall: Number(item.rainfall),
        });
      } catch (_e) {
        break;
      }
    }

    return list;
  }

  function buildLeaderboard(liveResponses, medianValue) {
    if (!liveResponses.length || medianValue === null) return [];

    return liveResponses.map((r, i) => ({
      address: localOracleAddrs[i] || `0xNode${i + 1}`,
      score: Math.max(40, 100 - Math.abs(r.rainfall - medianValue) * 18),
    }));
  }

  async function loadLiveData() {
    try {
      const [weatherRes] = await Promise.all([
        axios.get(`${API_BASE}/api/weather/final`),
      ]);

      setLatestWeather(weatherRes.data);

      const c = contract || (window.ethereum ? await getContract() : null);
      if (!contract && c) setContract(c);

      const liveResponses = await getOnchainResponses(c);
      setResponses(liveResponses);

      const values = liveResponses.map((r) => r.rainfall).sort((a, b) => a - b);
      const m = values.length ? values[Math.floor(values.length / 2)] : null;
      setOracles(buildLeaderboard(liveResponses, m));
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function createRequest() {
    setLoading(true);
    try {
      setNotice("Aggregating median via backend...");
      await axios.post(`${API_BASE}/api/weather/aggregate`);
      setNotice("Aggregation successful!");
      await loadLiveData();
    } catch (err) {
      setNotice(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">
      <Navbar account={account} onConnect={connectWallet} />

      <div className="hero card">
        <h3>Median Result</h3>
        <div className="median">{median ?? latestWeather?.rainfall ?? "-"} mm</div>
        <p>Round: {latestWeather?.currentRound ?? "-"}</p>
      </div>

      <div className="grid">
        <RequestCard createRequest={createRequest} loading={loading} />
        <ResponseList responses={responses} median={median} />
        <Leaderboard oracles={oracles} />
      </div>

      {notice ? <p className="notice">{notice}</p> : null}
    </div>
  );
}
