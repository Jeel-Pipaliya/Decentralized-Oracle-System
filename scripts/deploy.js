const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const WeatherOracle = await hre.ethers.getContractFactory("WeatherOracle");
  const oracle = await WeatherOracle.deploy();
  await oracle.deployed();

  console.log("WeatherOracle deployed to:", oracle.address);

  const CropInsurance = await hre.ethers.getContractFactory("CropInsurance");
  const insurance = await CropInsurance.deploy(oracle.address, 10, {
    value: hre.ethers.utils.parseEther("1"),
  });

  await insurance.deployed();
  console.log("CropInsurance deployed to:", insurance.address);

  console.log("Done!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
