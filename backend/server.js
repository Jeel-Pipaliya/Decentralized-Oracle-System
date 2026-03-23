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
  "event NodeRegistered(address indexed node)",
  "event WeatherSubmitted(address indexed node, uint temperature, uint rainfall, uint round)",
  "event WeatherAggregated(uint round, uint temperature, uint rainfall)",
];

const INSURANCE_ABI = [
  "function thresholdRainfall() view returns(uint)",
  "function checkAndPay()",
  "function registerFarmer(string memory _name, string memory _location, uint _insuranceAmount)",
  "function farmers(address) view returns(string name, string location, uint insuranceAmount, bool registered, bool paid)",
  "event FarmerRegistered(address indexed farmer, string name, string location, uint amount)",
  "event PayoutTriggered(address indexed farmer, uint amount)",
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
    const thresholdRainfall = await contract.thresholdRainfall();
    const balance = await provider.getBalance(requireEnv("INSURANCE_CONTRACT"));

    res.json({
      thresholdRainfall: Number(thresholdRainfall),
      balanceEth: ethers.formatEther(balance),
      paid: false // Deprecated global paid state, keep for fallback if frontend needs it temporarily
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/oracle/history", async (_req, res) => {
  try {
    const weatherContract = getWeatherContract(false);
    
    // Fetch recent events from the contract
    const submittedFilter = weatherContract.filters.WeatherSubmitted();
    const aggregatedFilter = weatherContract.filters.WeatherAggregated();
    
    // safely calculate fromBlock
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 1000);

    const submittedEvents = await weatherContract.queryFilter(submittedFilter, fromBlock, "latest");
    const aggregatedEvents = await weatherContract.queryFilter(aggregatedFilter, fromBlock, "latest");
    
    const logs = [];
    
    for (const ev of submittedEvents) {
      logs.push({
        type: "WeatherSubmitted",
        txHash: ev.transactionHash,
        node: ev.args[0],
        temperature: Number(ev.args[1]),
        rainfall: Number(ev.args[2]),
        round: Number(ev.args[3]),
        blockNumber: ev.blockNumber
      });
    }
    
    for (const ev of aggregatedEvents) {
      logs.push({
        type: "WeatherAggregated",
        txHash: ev.transactionHash,
        round: Number(ev.args[0]),
        temperature: Number(ev.args[1]),
        rainfall: Number(ev.args[2]),
        blockNumber: ev.blockNumber
      });
    }
    
    // Sort by block number descending
    logs.sort((a, b) => b.blockNumber - a.blockNumber);
    
    res.json(logs);
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

async function startWatcher() {
  console.log("Starting automatic payout watcher...");
  setInterval(async () => {
    try {
      const weatherContract = getWeatherContract(false);
      const currentRound = await weatherContract.currentRound();
      // Ensure at least one aggregation has happened before auto-paying based on (0,0) defaults
      if (Number(currentRound) <= 1) return;

      const [temp, rainfall] = await weatherContract.getFinalWeather();
      const insuranceContractOrigin = getInsuranceContract(false);
      const threshold = await insuranceContractOrigin.thresholdRainfall();

      if (Number(rainfall) < Number(threshold)) {
        console.log(`[Watcher] Condition met: rainfall ${rainfall} < threshold ${threshold}. Triggering checkAndPay...`);
        const insuranceContract = getInsuranceContract(true);
        // Call checkAndPay. Even if called multiple times, the contract checks `!farmers[addr].paid`.
        const tx = await insuranceContract.checkAndPay();
        await tx.wait();
        console.log(`[Watcher] checkAndPay successful. TX: ${tx.hash}`);
      }
    } catch (err) {
      // Ignore errors such as contracts not being deployed yet
      // console.error(err);
    }
  }, 10000);
}

async function startAggregator() {
  console.log("Starting automatic aggregator...");
  setInterval(async () => {
    try {
      const weatherContract = getWeatherContract(false);
      // Try to read the 3rd submission (index 2)
      try {
        await weatherContract.submissions(2); 
        // If it succeeds, 3 submissions exist. Trigger aggregation
        console.log("[Aggregator] 3 submissions found. Triggering aggregateMedian...");
        const signerContract = getWeatherContract(true);
        const tx = await signerContract.aggregateMedian();
        await tx.wait();
        console.log(`[Aggregator] aggregateMedian successful! TX: ${tx.hash}`);
      } catch (e) {
        // Not enough submissions yet, do nothing.
      }
    } catch (err) {
      // Ignore general lookup errors
    }
  }, 8000);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startWatcher();
  startAggregator();
});
