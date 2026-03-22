const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

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

  const outputPath = path.join(__dirname, "..", "deployments.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        network: hre.network.name,
        weatherOracle: oracleAddress,
        cropInsurance: insuranceAddress,
      },
      null,
      2
    )
  );
  console.log("Saved deployment addresses to:", outputPath);

  const envPath = path.join(__dirname, "..", ".env");
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  envContent = envContent.replace(/ORACLE_CONTRACT=.*/, `ORACLE_CONTRACT=${oracleAddress}`);
  envContent = envContent.replace(/INSURANCE_CONTRACT=.*/, `INSURANCE_CONTRACT=${insuranceAddress}`);
  fs.writeFileSync(envPath, envContent);
  console.log("Updated .env with newly deployed contract addresses.");

  console.log("Done!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
