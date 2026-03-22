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
  "function aggregateMedian()",
  "function submissions(uint) view returns(uint temperature, uint rainfall)",
];

const INSURANCE_ABI = [
  "function paid() view returns(bool)",
  "function thresholdRainfall() view returns(uint)",
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

app.get("/api/health", async (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/weather/final", async (_req, res) => {
  try {
    const contract = getWeatherContract(false);
    const [temperature, rainfall] = await contract.getFinalWeather();
    const currentRound = await contract.currentRound();

    res.json({
      temperature: Number(temperature),
      rainfall: Number(rainfall),
      currentRound: Number(currentRound),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/insurance/status", async (_req, res) => {
  try {
    const contract = getInsuranceContract(false);
    const paid = await contract.paid();
    const thresholdRainfall = await contract.thresholdRainfall();
    const balance = await provider.getBalance(requireEnv("INSURANCE_CONTRACT"));

    res.json({
      paid,
      thresholdRainfall: Number(thresholdRainfall),
      balanceEth: ethers.formatEther(balance),
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
