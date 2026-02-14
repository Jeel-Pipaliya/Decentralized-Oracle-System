const axios = require("axios");
const { ethers } = require("ethers");
require("dotenv").config();

const ABI = [
  "function submitWeather(uint temp, uint rain) public",
];

async function fetchWeather() {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=21.1702&longitude=72.8311&current=temperature_2m,precipitation,rain&timezone=auto";

  const res = await axios.get(url);

  const temp = Math.floor(res.data.current.temperature_2m);
  const rain = Math.floor(res.data.current.rain || 0);

  return { temp, rain };
}

async function submitToBlockchain(temp, rain) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const contract = new ethers.Contract(
    process.env.ORACLE_CONTRACT,
    ABI,
    wallet
  );

  const tx = await contract.submitWeather(temp, rain);
  await tx.wait();

  console.log(`Submitted: Temp=${temp}°C Rain=${rain}mm`);
}

async function start() {
  setInterval(async () => {
    try {
      const { temp, rain } = await fetchWeather();
      await submitToBlockchain(temp, rain);
    } catch (err) {
      console.log("Error:", err.message);
    }
  }, 15000);
}

start();
