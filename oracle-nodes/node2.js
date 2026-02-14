const axios = require("axios");
const { ethers } = require("ethers");
require("dotenv").config();

const ABI = [
  "function submitWeather(uint temp, uint rain) public",
];

async function fetchWeather() {
  const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_KEY}&q=Surat&aqi=no`;

  const res = await axios.get(url);

  const temp = Math.floor(res.data.current.temp_c);
  const rain = Math.floor(res.data.current.precip_mm || 0);

  return { temp, rain };
}

async function submitToBlockchain(temp, rain) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    ABI,
    wallet
  );

  const tx = await contract.submitWeather(temp, rain);
  await tx.wait();

  console.log(`Node2 Submitted: Temp=${temp}°C Rain=${rain}mm`);
}

async function start() {
  setInterval(async () => {
    try {
      const { temp, rain } = await fetchWeather();
      await submitToBlockchain(temp, rain);
    } catch (err) {
      console.log("Node2 Error:", err.message);
    }
  }, 20000);
}

start();
