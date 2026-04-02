const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
require("dotenv").config({ path: __dirname + "/../.env" });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const WEATHER_ABI = [
  "function getFinalWeather() view returns(uint,uint)",
  "function currentRound() view returns(uint)",
  "function lastAggregatedRound() view returns(uint)",
  "function getSubmissionCount() view returns(uint)",
  "function getSubmissionAt(uint index) view returns(uint temperature, uint rainfall)",
  "function isNodeAuthorized(address node) view returns(bool)",
  "function aggregateMedian()",
];

const INSURANCE_ABI = [
  "function paid() view returns(bool)",
  "function thresholdRainfall() view returns(uint)",
  "function lastProcessedRound() view returns(uint)",
  "function lastPayoutAmount() view returns(uint)",
  "function getPolicyStatus() view returns(bool,uint,uint,uint,uint)",
  "function checkAndPay()",
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required in .env`);
  }
  return value;
}

function getWallet() {
  const privateKey = process.env.OWNER_PRIVATE_KEY || process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("OWNER_PRIVATE_KEY or PRIVATE_KEY is required in .env");
  }
  return new ethers.Wallet(privateKey, provider);
}

function getWeatherContract(withSigner = false) {
  const address = requireEnv("ORACLE_CONTRACT");
  return new ethers.Contract(address, WEATHER_ABI, withSigner ? getWallet() : provider);
}

function getInsuranceContract(withSigner = false) {
  const address = requireEnv("INSURANCE_CONTRACT");
  return new ethers.Contract(address, INSURANCE_ABI, withSigner ? getWallet() : provider);
}

function getConfiguredOracleNodes() {
  return (process.env.ORACLE_NODE_ADDRESSES || "")
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);
}

app.get("/api/health", async (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/weather/final", async (_req, res) => {
  try {
    const contract = getWeatherContract(false);
    const [temperature, rainfall] = await contract.getFinalWeather();
    const currentRound = await contract.currentRound();
    const lastAggregatedRound = await contract.lastAggregatedRound();
    const submissionsCount = await contract.getSubmissionCount();

    res.json({
      temperature: Number(temperature),
      rainfall: Number(rainfall),
      currentRound: Number(currentRound),
      lastAggregatedRound: Number(lastAggregatedRound),
      submissionsCount: Number(submissionsCount),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/insurance/status", async (_req, res) => {
  try {
    const contract = getInsuranceContract(false);
    const [paid, thresholdRainfall, lastProcessedRound, contractBalance, lastPayoutAmount] =
      await contract.getPolicyStatus();
    const balance = await provider.getBalance(requireEnv("INSURANCE_CONTRACT"));

    res.json({
      paid,
      thresholdRainfall: Number(thresholdRainfall),
      lastProcessedRound: Number(lastProcessedRound),
      contractBalanceWei: contractBalance.toString(),
      lastPayoutAmountEth: ethers.formatEther(lastPayoutAmount),
      balanceEth: ethers.formatEther(balance),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/weather/submissions", async (_req, res) => {
  try {
    const contract = getWeatherContract(false);
    const count = Number(await contract.getSubmissionCount());
    const entries = [];

    for (let i = 0; i < count; i += 1) {
      const [temperature, rainfall] = await contract.getSubmissionAt(i);
      entries.push({
        index: i,
        temperature: Number(temperature),
        rainfall: Number(rainfall),
      });
    }

    res.json({ count, entries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/oracle/nodes", async (_req, res) => {
  try {
    const contract = getWeatherContract(false);
    const nodes = getConfiguredOracleNodes();

    const statuses = await Promise.all(
      nodes.map(async (nodeAddress) => ({
        nodeAddress,
        authorized: await contract.isNodeAuthorized(nodeAddress),
      }))
    );

    res.json({
      totalConfigured: nodes.length,
      statuses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/system/overview", async (_req, res) => {
  try {
    const weather = await getWeatherContract(false);
    const insurance = await getInsuranceContract(false);

    const [temperature, rainfall] = await weather.getFinalWeather();
    const currentRound = Number(await weather.currentRound());
    const lastAggregatedRound = Number(await weather.lastAggregatedRound());
    const submissionsCount = Number(await weather.getSubmissionCount());

    const [paid, thresholdRainfall, lastProcessedRound, _contractBalance, lastPayoutAmount] =
      await insurance.getPolicyStatus();

    res.json({
      weather: {
        temperature: Number(temperature),
        rainfall: Number(rainfall),
        currentRound,
        lastAggregatedRound,
        submissionsCount,
      },
      insurance: {
        paid,
        thresholdRainfall: Number(thresholdRainfall),
        lastProcessedRound: Number(lastProcessedRound),
        lastPayoutAmountEth: ethers.formatEther(lastPayoutAmount),
      },
      checks: {
        canAggregate: submissionsCount >= 3,
        canCheckPay: !paid && lastAggregatedRound > Number(lastProcessedRound),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/weather/aggregate", async (_req, res) => {
  try {
    const contract = getWeatherContract(true);
    const tx = await contract.aggregateMedian();
    await tx.wait();

    res.json({ ok: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/insurance/check-pay", async (_req, res) => {
  try {
    const contract = getInsuranceContract(true);
    const tx = await contract.checkAndPay();
    await tx.wait();

    res.json({ ok: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
