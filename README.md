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
│ │ ├── App.js
│ │ ├── WeatherDashboard.js
│
├── hardhat.config.js
├── package.json
└── README.md

---

## ✅ Prioritized Implementation Checklist

### P0 - Must Complete First

- [ ] Standardize environment variables across all oracle nodes and scripts (`ORACLE_CONTRACT`, `RPC_URL`, keys)
- [ ] Replace hardcoded addresses in registration/deployment scripts with `.env` or deployment output
- [ ] Register 3 distinct oracle node wallets and verify each can submit exactly once per weather round
- [ ] Build minimum backend API endpoints for latest aggregated weather and insurance status

### P1 - Core Product Completion

- [ ] Connect frontend dashboard to backend/on-chain data (remove placeholder state)
- [ ] Add aggregation trigger flow (manual button or scheduled script)
- [ ] Complete Crop Insurance flow: fund contract, run `checkAndPay`, show payout result in UI
- [ ] Keep only one frontend app folder (`frontend/` or `client/`) to avoid duplication

### P2 - Quality and Delivery

- [ ] Add Hardhat tests for median aggregation, authorization, and insurance payout logic
- [ ] Add npm scripts and README run steps for: blockchain, deploy, register nodes, run nodes, backend, frontend
- [ ] Improve failure handling and logs for API errors, rejected transactions, and empty submission rounds

### Definition of Done

- [ ] 3 nodes submit weather successfully
- [ ] Median aggregation updates final on-chain weather
- [ ] Frontend shows live final weather and insurance status
- [ ] Insurance payout triggers correctly when rainfall is below threshold
- [ ] Tests pass locally

---

## 🧭 Step-by-Step Plan For All Remaining Work

Follow these steps in order. Complete one step fully before moving to the next.

### Step 1: Decide the single frontend app

1. Keep only one UI folder (`frontend/` recommended).
2. Move any useful code from `client/` into `frontend/`.
3. Remove or archive unused frontend folder to avoid confusion.

### Step 2: Standardize environment variables

1. Define one naming standard in root `.env` (for example: `RPC_URL`, `PRIVATE_KEY`, `ORACLE_CONTRACT`).
2. Update all oracle node scripts to use the same exact variable names.
3. Update `.env.example` to match real variables used by scripts.

### Step 3: Remove hardcoded addresses

1. Update deployment flow to output deployed contract addresses.
2. Update `registernode.js` to read contract and node addresses from `.env` or script args.
3. Verify no static `0x...` values remain in scripts.

### Step 4: Register three oracle nodes correctly

1. Create 3 node wallets/private keys for local development.
2. Register all 3 node addresses in `WeatherOracle`.
3. Confirm each registered node is marked `authorized` on-chain.

### Step 5: Enforce one submission per node per round

1. Add round-based tracking in `WeatherOracle`.
2. Ensure one node can submit only once in the current round.
3. Reset submission flags when a new round starts after aggregation.

### Step 6: Build minimum backend APIs

1. Add endpoint to return final aggregated weather from contract.
2. Add endpoint to return insurance contract status (`paid`, threshold, balance).
3. Add endpoint to trigger aggregation (owner-only flow).

### Step 7: Wire frontend to real data

1. Replace placeholder state in dashboard with API calls.
2. Show loading, success, and error states.
3. Display temperature, rainfall, and insurance status clearly.

### Step 8: Complete insurance payout flow

1. Ensure insurance contract receives funds on deploy or via funding function.
2. Trigger `checkAndPay` after final weather is available.
3. Display payout result and transaction status in UI/backend response.

### Step 9: Add aggregation trigger workflow

1. Choose trigger mode: manual button or scheduled backend task.
2. Add validation (`minimum submissions`) before calling aggregate.
3. Log round ID, submissions count, and final median values.

### Step 10: Add tests before polish

1. Test node authorization and rejection of unauthorized submitters.
2. Test median calculation including outlier data.
3. Test insurance payout and already-paid protection.

### Step 11: Improve scripts and docs

1. Add npm scripts for each run target (node, deploy, backend, frontend, oracle nodes).
2. Add one clean run order section in README from start to finish.
3. Add troubleshooting notes for common errors (env missing, tx revert, API key issues).

### Step 12: Final end-to-end validation

1. Start local blockchain and deploy contracts.
2. Register nodes and run all oracle node services.
3. Trigger aggregation and verify final weather updates on-chain.
4. Run insurance check and confirm payout behavior.
5. Run tests and confirm all pass.
