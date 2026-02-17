const axios = require("axios");
const { ethers } = require("ethers");
require("dotenv").config({ path: "../.env" });

const ABI = [
  "function submitWeather(uint temp, uint rain) public",
];

async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Surat&appid=${process.env.OPENWEATHER_KEY}&units=metric`;

  const res = await axios.get(url);

  const temp = Math.floor(res.data.main.temp);
  const rain = Math.floor(res.data.rain?.["1h"] || 0);

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

  console.log(`Node3 Submitted: Temp=${temp}°C Rain=${rain}mm`);
}

async function start() {
  setInterval(async () => {
    try {
      const { temp, rain } = await fetchWeather();
      await submitToBlockchain(temp, rain);
    } catch (err) {
      console.log("Node3 Error:", err.message);
    }
  }, 25000);
}

start();
