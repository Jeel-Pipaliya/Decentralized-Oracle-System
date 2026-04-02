const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WeatherOracle + CropInsurance", function () {
  async function deploySystem(threshold = 10) {
    const [owner, farmer, node1, node2, node3, outsider] = await ethers.getSigners();

    const Oracle = await ethers.getContractFactory("WeatherOracle", owner);
    const oracle = await Oracle.deploy();
    await oracle.waitForDeployment();

    const Insurance = await ethers.getContractFactory("CropInsurance", farmer);
    const insurance = await Insurance.deploy(await oracle.getAddress(), threshold, {
      value: ethers.parseEther("1"),
    });
    await insurance.waitForDeployment();

    return { owner, farmer, node1, node2, node3, outsider, oracle, insurance };
  }

  it("allows only owner to register nodes and only registered nodes to submit", async function () {
    const { owner, node1, outsider, oracle } = await deploySystem();

    await expect(oracle.connect(outsider).registerNode(node1.address)).to.be.revertedWith("Only owner allowed");

    await expect(oracle.connect(owner).registerNode(node1.address))
      .to.emit(oracle, "NodeRegistered")
      .withArgs(node1.address);

    await expect(oracle.connect(outsider).submitWeather(30, 2)).to.be.revertedWith("Not authorized node");

    await expect(oracle.connect(node1).submitWeather(30, 2))
      .to.emit(oracle, "WeatherSubmitted");
  });

  it("enforces one submission per node per round", async function () {
    const { owner, node1, oracle } = await deploySystem();

    await oracle.connect(owner).registerNode(node1.address);
    await oracle.connect(node1).submitWeather(30, 2);

    await expect(oracle.connect(node1).submitWeather(29, 1)).to.be.revertedWith(
      "Node already submitted in this round"
    );
  });

  it("aggregates median values and advances round", async function () {
    const { owner, node1, node2, node3, oracle } = await deploySystem();

    await oracle.connect(owner).registerNode(node1.address);
    await oracle.connect(owner).registerNode(node2.address);
    await oracle.connect(owner).registerNode(node3.address);

    await oracle.connect(node1).submitWeather(31, 2);
    await oracle.connect(node2).submitWeather(100, 100);
    await oracle.connect(node3).submitWeather(30, 1);

    await expect(oracle.connect(owner).aggregateMedian())
      .to.emit(oracle, "WeatherAggregated");

    const [temp, rain] = await oracle.getFinalWeather();
    expect(temp).to.equal(31n);
    expect(rain).to.equal(2n);
    expect(await oracle.lastAggregatedRound()).to.equal(1n);
    expect(await oracle.currentRound()).to.equal(2n);
    expect(await oracle.getSubmissionCount()).to.equal(0n);
  });

  it("pays farmer when rainfall is below threshold and prevents duplicate payout", async function () {
    const { owner, farmer, node1, node2, node3, oracle, insurance } = await deploySystem(10);

    await oracle.connect(owner).registerNode(node1.address);
    await oracle.connect(owner).registerNode(node2.address);
    await oracle.connect(owner).registerNode(node3.address);

    await oracle.connect(node1).submitWeather(35, 2);
    await oracle.connect(node2).submitWeather(34, 1);
    await oracle.connect(node3).submitWeather(36, 0);
    await oracle.connect(owner).aggregateMedian();

    const before = await ethers.provider.getBalance(farmer.address);

    const tx = await insurance.connect(owner).checkAndPay();
    await tx.wait();

    const after = await ethers.provider.getBalance(farmer.address);

    expect(await insurance.paid()).to.equal(true);
    expect(await insurance.lastProcessedRound()).to.equal(1n);
    expect(await insurance.lastPayoutAmount()).to.equal(ethers.parseEther("1"));
    expect(after).to.equal(before + ethers.parseEther("1"));

    await expect(insurance.connect(owner).checkAndPay()).to.be.revertedWith("Already paid");
  });
});
