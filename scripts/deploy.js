const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const WeatherOracle = await hre.ethers.getContractFactory("WeatherOracle");
  const oracle = await WeatherOracle.deploy();
  await oracle.waitForDeployment();   

  const oracleAddress = await oracle.getAddress(); 
  console.log("WeatherOracle deployed to:", oracleAddress);

  const CropInsurance = await hre.ethers.getContractFactory("CropInsurance");
  const insurance = await CropInsurance.deploy(
    oracleAddress,
    10,
    {
      value: hre.ethers.parseEther("1"), 
    }
  );

  await insurance.waitForDeployment();   

  const insuranceAddress = await insurance.getAddress(); 
  console.log("CropInsurance deployed to:", insuranceAddress);

  console.log("Done!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
