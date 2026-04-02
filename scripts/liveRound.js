const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const oracleAddress = process.env.ORACLE_CONTRACT;
  const insuranceAddress = process.env.INSURANCE_CONTRACT;

  if (!oracleAddress) {
    throw new Error("ORACLE_CONTRACT is required in .env");
  }
  if (!insuranceAddress) {
    throw new Error("INSURANCE_CONTRACT is required in .env");
  }

  const oracle = await hre.ethers.getContractAt("WeatherOracle", oracleAddress);
  const insurance = await hre.ethers.getContractAt("CropInsurance", insuranceAddress);
  const signers = await hre.ethers.getSigners();
  const owner = signers[0];

  const nodePayloads = [
    { signer: signers[1], temp: 31, rain: 2 },
    { signer: signers[2], temp: 30, rain: 1 },
    { signer: signers[3], temp: 32, rain: 0 },
  ];

  console.log(`Owner: ${owner.address}`);

  for (const payload of nodePayloads) {
    const nodeInfo = await oracle.nodes(payload.signer.address);
    if (!nodeInfo.authorized) {
      const regTx = await oracle.connect(owner).registerNode(payload.signer.address);
      await regTx.wait();
      console.log(`Registered node ${payload.signer.address}`);
    }
  }

  for (const payload of nodePayloads) {
    const tx = await oracle.connect(payload.signer).submitWeather(payload.temp, payload.rain);
    await tx.wait();
    console.log(
      `Submitted by ${payload.signer.address}: temp=${payload.temp}, rain=${payload.rain}`
    );
  }

  const aggregateTx = await oracle.connect(owner).aggregateMedian();
  await aggregateTx.wait();
  console.log(`Aggregation tx: ${aggregateTx.hash}`);

  const checkTx = await insurance.connect(owner).checkAndPay();
  await checkTx.wait();
  console.log(`Insurance check tx: ${checkTx.hash}`);

  const [finalTemp, finalRain] = await oracle.getFinalWeather();
  const paid = await insurance.paid();
  const round = await oracle.lastAggregatedRound();

  console.log("E2E round completed.");
  console.log(`Round=${round} FinalTemp=${finalTemp} FinalRain=${finalRain} Paid=${paid}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
