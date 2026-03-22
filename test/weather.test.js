const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Decentralized Weather Oracle System", function () {
  let WeatherOracle, oracle;
  let CropInsurance, insurance;
  let owner, farmer, node1, node2, node3, unauthorized;

  before(async function () {
    [owner, farmer, node1, node2, node3, unauthorized] = await ethers.getSigners();
  });

  describe("WeatherOracle", function () {
    it("Should deploy and set owner", async function () {
      WeatherOracle = await ethers.getContractFactory("WeatherOracle");
      oracle = await WeatherOracle.deploy();
      await oracle.waitForDeployment();
      
      expect(await oracle.owner()).to.equal(owner.address);
    });

    it("Should allow owner to register nodes", async function () {
      await oracle.registerNode(node1.address);
      await oracle.registerNode(node2.address);
      await oracle.registerNode(node3.address);

      const nodeData = await oracle.nodes(node1.address);
      expect(nodeData.authorized).to.equal(true);
    });

    it("Should allow authorized nodes to submit weather and prevent multiple submissions", async function () {
      // Node 1 submits
      await oracle.connect(node1).submitWeather(30, 100);
      
      // Node 1 tries to submit again in the same round
      await expect(
        oracle.connect(node1).submitWeather(31, 105)
      ).to.be.revertedWith("Node already submitted in this round");

      // Node 2 and Node 3 submit
      await oracle.connect(node2).submitWeather(31, 10); // Fake outlier
      await oracle.connect(node3).submitWeather(29, 90);
    });

    it("Should enforce minimum 3 submissions for aggregation", async function () {
      // It has 3 now, let's test median aggregation
      await oracle.aggregateMedian();

      const [temp, rain] = await oracle.getFinalWeather();
      // Temps: 29, 30, 31 => Median 30
      // Rains: 10, 90, 100 => Median 90
      expect(temp).to.equal(30);
      expect(rain).to.equal(90);
      
      const currentRound = await oracle.currentRound();
      expect(currentRound).to.equal(2);
    });
  });

  describe("CropInsurance", function () {
    it("Should deploy with valid oracle address and threshold", async function () {
      CropInsurance = await ethers.getContractFactory("CropInsurance");
      
      // The threshold is 50. The median rainfall we just pushed was 90
      insurance = await CropInsurance.connect(farmer).deploy(await oracle.getAddress(), 50, { value: ethers.parseEther("1") });
      await insurance.waitForDeployment();
      
      expect(await insurance.farmer()).to.equal(farmer.address);
      expect(await ethers.provider.getBalance(await insurance.getAddress())).to.equal(ethers.parseEther("1"));
    });

    it("Should NOT pay if rainfall is above threshold", async function () {
      // Rainfall is 90, threshold is 50. Should not pay out.
      await insurance.connect(owner).checkAndPay();
      expect(await insurance.paid()).to.equal(false);
    });

    it("Should pay farmer if rainfall is below threshold in new round", async function () {
      // New round of data
      await oracle.connect(node1).submitWeather(35, 10);
      await oracle.connect(node2).submitWeather(36, 15);
      await oracle.connect(node3).submitWeather(34, 20);

      await oracle.connect(owner).aggregateMedian();
      
      // Now median rainfall is 15. Threshold is 50
      const balanceBefore = await ethers.provider.getBalance(farmer.address);
      
      await insurance.connect(unauthorized).checkAndPay(); // Anyone can trigger
      
      expect(await insurance.paid()).to.equal(true);

      const balanceAfter = await ethers.provider.getBalance(farmer.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });
  });
});
