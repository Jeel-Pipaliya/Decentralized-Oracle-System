const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddress = process.env.ORACLE_CONTRACT;
  const nodeAddresses = (process.env.ORACLE_NODE_ADDRESSES || "")
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);

  if (!contractAddress) {
    throw new Error("ORACLE_CONTRACT is required in .env");
  }

  if (nodeAddresses.length === 0) {
    throw new Error("ORACLE_NODE_ADDRESSES is required in .env (comma separated)");
  }

  const [owner] = await ethers.getSigners();
  console.log("Registering nodes with owner:", owner.address);

  const oracle = await ethers.getContractAt("WeatherOracle", contractAddress);

  for (const nodeAddress of nodeAddresses) {
    const tx = await oracle.registerNode(nodeAddress);
    await tx.wait();
    console.log("Node registered:", nodeAddress);
  }

  console.log("All nodes registered successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
