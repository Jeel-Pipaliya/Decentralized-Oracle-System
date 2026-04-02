const axios = require("axios");
const { ethers } = require("ethers");
require("dotenv").config({ path: __dirname + "/../.env" });


const ABI = [
  "function submitWeather(uint temp, uint rain) public",
];

async function fetchFallbackWeather() {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=21.1702&longitude=72.8311&current=temperature_2m,precipitation,rain&timezone=auto";

  const res = await axios.get(url);
  return {
    temp: Math.floor(res.data.current.temperature_2m),
    rain: Math.floor(res.data.current.rain || 0),
  };
}

async function fetchWeather() {
  if (!process.env.WEATHERAPI_KEY) {
    return fetchFallbackWeather();
  }

  const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_KEY}&q=Surat&aqi=no`;

  try {
    const res = await axios.get(url);

    const temp = Math.floor(res.data.current.temp_c);
    const rain = Math.floor(res.data.current.precip_mm || 0);

    return { temp, rain };
  } catch (_error) {
    // Fall back to a free API when key is invalid/rate-limited.
    return fetchFallbackWeather();
  }
}

async function submitToBlockchain(temp, rain) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(
    process.env.NODE2_PRIVATE_KEY || process.env.PRIVATE_KEY,
    provider
  );

  const contract = new ethers.Contract(
    process.env.ORACLE_CONTRACT,
    ABI,
    wallet
  );

  const tx = await contract.submitWeather(temp, rain);
  await tx.wait();

  console.log(`Node2 Submitted: Temp=${temp}°C Rain=${rain}mm`);
}

async function start() {
  const loop = async () => {
    try {
      const { temp, rain } = await fetchWeather();
      await submitToBlockchain(temp, rain);
    } catch (err) {
      const message = err?.shortMessage || err?.reason || err.message;
      if (message.includes("already submitted") || message.includes("Not authorized")) {
        console.log(`Node2 skipped submit: ${message}`);
      } else {
        console.log("Node2 Error:", message);
      }
    }
  };

  await loop();
  setInterval(loop, 20000);
}

start();
