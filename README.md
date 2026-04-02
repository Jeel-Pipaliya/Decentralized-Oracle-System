# 🌦️ Decentralized Weather Oracle Improvement System

A blockchain-based decentralized oracle system that fetches real-world weather data from multiple oracle nodes and stores the final trusted weather result on the blockchain using a Median Aggregation mechanism.

This project demonstrates how smart contracts can securely use real-world weather data for real-life applications such as Crop Insurance, Disaster Alerts, and Smart Agriculture.

---

## 📌 Problem Statement

Smart contracts cannot directly access real-world weather data (temperature, rainfall, humidity, etc.).  
Traditional oracles are often centralized and can be manipulated.

This project solves the Oracle Problem by creating a decentralized weather oracle network with multiple nodes and an aggregation algorithm to ensure reliability.

---

## 🎯 Project Objectives

- Provide real-time weather data to blockchain smart contracts
- Use multiple oracle nodes to avoid centralized control
- Prevent fake/outlier weather data submissions
- Use Median Aggregation for accurate final result
- Support smart contract use cases like Crop Insurance payout automation

---

## 🚀 Key Features

✅ Multiple Oracle Nodes (Node1, Node2, Node3)  
✅ Fetches live weather data from OpenWeatherMap API  
✅ Blockchain storage of final trusted weather output  
✅ Median Aggregation to ignore fake/outlier values  
✅ Smart Crop Insurance contract integration  
✅ React Frontend Dashboard for visualization  
✅ Easy to deploy and run locally using Hardhat  

---

## 🏗️ System Architecture

### Workflow:
1. Oracle nodes fetch weather data from API.
2. Each node submits temperature and rainfall to smart contract.
3. Smart contract stores all submissions.
4. Owner triggers aggregation function.
5. Median value is calculated to remove outliers.
6. Final weather data is stored on blockchain.
7. Consumer contract (Crop Insurance) reads weather and triggers payout.

---

## 🧠 Aggregation Logic Used

### 📌 Median Aggregation
Median aggregation ensures that fake or extreme weather values do not affect the final result.

Example:
Values submitted: 30°C, 31°C, 100°C  
Median = 31°C ✅  
Fake value ignored.

---

## 🌍 Real-Life Use Cases

- 🌾 Crop Insurance Smart Contract (Auto payout on drought conditions)
- 🌪️ Flood / Disaster Insurance Automation
- ✈️ Event or Flight Delay Insurance
- 🏙️ Smart City Weather Monitoring
- 🚜 Smart Agriculture Systems

---

## 🛠️ Tech Stack Used

### Blockchain
- Solidity
- Hardhat
- Ethereum Local Blockchain (Hardhat Node)

### Oracle Nodes
- Node.js
- Axios
- Ethers.js

### Frontend
- React.js
- MetaMask Integration
- Ethers.js

### API Source
- OpenWeatherMap API

---

## ⚙️ Environment Setup

1. Copy `.env.example` to `.env` and fill required values.
2. Set `ORACLE_NODE_ADDRESSES` to three wallets that will run node scripts.
3. After deployment, update these two addresses in `.env`:
	- `ORACLE_CONTRACT`
	- `INSURANCE_CONTRACT`

---

## ▶️ Run End-to-End (Local)

Open separate terminals and run in this order:

1. Start Hardhat local chain
```bash
npm run start
```

2. Deploy contracts
```bash
npm run deploy
```

3. Register oracle nodes
```bash
npm run register:nodes
```

4. Start backend API
```bash
npm run backend
```

5. Start three oracle node processes
```bash
npm run oracle:node1
npm run oracle:node2
npm run oracle:node3
```

6. Start frontend
```bash
npm run frontend
```

7. Optional one-shot e2e round script
```bash
npm run e2e:round
```

---

## 🔌 Backend APIs

- `GET /api/health` - API health check
- `GET /api/weather/final` - final aggregated weather + round metadata
- `GET /api/weather/submissions` - submissions in current round
- `GET /api/oracle/nodes` - configured node authorization statuses
- `GET /api/insurance/status` - insurance policy and payout status
- `GET /api/system/overview` - combined weather + insurance + action readiness
- `POST /api/weather/aggregate` - owner call to aggregate median
- `POST /api/insurance/check-pay` - owner call to run payout check

---

## 🧪 Testing

Run contract tests:

```bash
npm test
```

Current tests cover:
- Owner-only node registration
- Authorized node submission checks
- One submission per node per round
- Median aggregation with outlier input
- Crop insurance payout and replay protection

---

## 📁 Project Folder Structure

weather-oracle-project/
│
├── contracts/
│ ├── WeatherOracle.sol
│ ├── CropInsurance.sol
│
├── scripts/
│ ├── deploy.js
│
├── oracle-nodes/
│ ├── node1.js
│ ├── node2.js
│ ├── node3.js
│ ├── abi.json
│ ├── .env.example
│
├── frontend/
│ ├── src/
│ │ ├── App.tsx
│ │ ├── Landing.tsx
│ │ ├── Dashboard.tsx
├── frontend-legacy/ (archived CRA app)
│
├── hardhat.config.js
├── package.json
└── README.md

---
