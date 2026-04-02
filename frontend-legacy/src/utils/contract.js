import { ethers } from "ethers";

const contractAddress =
  process.env.REACT_APP_ORACLE_CONTRACT || "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

const abi = [
  "function submissions(uint) view returns(uint temperature, uint rainfall)",
  "function getFinalWeather() view returns(uint,uint)",
  "function currentRound() view returns(uint)",
  "function lastAggregatedRound() view returns(uint)",
  "function getSubmissionCount() view returns(uint)",
  "function aggregateMedian()",
];

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, abi, signer);
};
