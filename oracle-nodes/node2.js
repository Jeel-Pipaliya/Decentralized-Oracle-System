const axios = require("axios");
const { ethers } = require("ethers");
require("dotenv").config({ path: __dirname + "/../.env" });


const ABI = [
  "function submitWeather(uint temp, uint rain) public",
  "function currentRound() view returns(uint)",
  "function hasSubmittedInRound(uint, address) view returns(bool)"
];

async function fetchWeather() {
  const url = `https://wttr.in/Surat?format=j1`;

  const res = await axios.get(url);

  const temp = Math.floor(res.data.current_condition[0].temp_C);
  const rain = Math.floor(res.data.current_condition[0].precipMM || 0);

  return { temp, rain };
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
  
  const round = await contract.currentRound();
  const submitted = await contract.hasSubmittedInRound(round, wallet.address);
  if (submitted) {
    console.log(`Node2: Already submitted for round ${round}. Waiting for next round...`);
    return;
  }

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
