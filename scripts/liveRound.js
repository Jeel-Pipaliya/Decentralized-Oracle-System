const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const oracleAddress = process.env.ORACLE_CONTRACT;

  if (!oracleAddress) {
    throw new Error("ORACLE_CONTRACT is required in .env");
  }

  const oracle = await hre.ethers.getContractAt("WeatherOracle", oracleAddress);
  const signers = await hre.ethers.getSigners();

  const nodePayloads = [
    { signer: signers[1], temp: 31, rain: 2 },
    { signer: signers[2], temp: 30, rain: 1 },
    { signer: signers[3], temp: 32, rain: 0 },
  ];

  for (const payload of nodePayloads) {
    const tx = await oracle.connect(payload.signer).submitWeather(payload.temp, payload.rain);
    await tx.wait();
    console.log(
      `Submitted by ${payload.signer.address}: temp=${payload.temp}, rain=${payload.rain}`
    );
  }

  console.log("3 submissions completed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
