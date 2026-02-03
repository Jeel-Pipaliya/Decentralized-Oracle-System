# 🚀 Decentralized Oracle Improvement System

A blockchain-based decentralized oracle framework designed to **improve data reliability, security, and fault tolerance** by aggregating data from multiple APIs using trust scoring, consensus mechanisms, and fallback strategies.

---

## 📌 Problem Statement

Smart contracts cannot directly access off-chain data. Traditional oracle systems often rely on:
- Single or limited data sources  
- Centralized providers  
- No transparent validation mechanism  

This leads to issues like:
- Data manipulation  
- Single point of failure  
- Lack of trust and reliability  

---

## 🎯 Project Objective

The objective of this project is to design and implement an **improved decentralized oracle system** that:
- Collects data from **multiple independent APIs**
- Validates data using **consensus logic**
- Assigns **trust scores** to data sources
- Ensures **high availability and fault tolerance**

---

## 🧠 Scope of the Project (Specific Scope)

This project specifically focuses on:

- 🔗 **Multi-API Data Aggregation**  
  Fetching the same data from multiple off-chain APIs.

- 🧮 **Consensus-Based Data Validation**  
  Final oracle output is selected using majority/median consensus.

- ⭐ **Trust Score Mechanism**  
  Each data source is assigned a trust score based on:
  - Historical accuracy  
  - Response time  
  - Availability  

- 🔁 **Fault Tolerance & Fallback**  
  If one or more APIs fail or return abnormal data, the system continues to function using valid sources.

- 🔐 **Tamper-Resistant Oracle Design**  
  Data is validated before being written on-chain to reduce manipulation risk.

> ⚠️ Note:  
> The scope does **not** include oracle node incentives, staking economics, or large-scale mainnet deployment.

---

## 🏗️ System Architecture

1. **Off-Chain Data Sources (APIs)**  
2. **Oracle Aggregation Layer**  
3. **Consensus & Trust Evaluation Module**  
4. **Smart Contract Interface**  
5. **Blockchain Network**

---

## 🛠️ Technologies Used

- **Blockchain Platform**: Ethereum / Polygon  
- **Smart Contracts**: Solidity  
- **Backend / Oracle Logic**: Node.js / Python  
- **APIs**: Public REST APIs(sports)
- **Tools**:  
  - Web3.js / Ethers.js  
  - Hardhat / Remix  
  - MetaMask  

---

## 📂 Project Structure

```text
├── contracts/
│   └── OracleContract.sol
├── oracle-node/
│   ├── api_fetcher.js
│   ├── consensus_engine.js
│   └── trust_score.js
├── scripts/
│   └── deploy.js
├── test/
│   └── oracle.test.js
├── docs/
│   └── architecture.md
├── README.md
