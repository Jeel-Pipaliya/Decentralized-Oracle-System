const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; 

  const [owner] = await ethers.getSigners();

  const oracle = await ethers.getContractAt("WeatherOracle", contractAddress);

  const nodeAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const tx = await oracle.registerNode(nodeAddress);
  await tx.wait();

  console.log("Node registered successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
