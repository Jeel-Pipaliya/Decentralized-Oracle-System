// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWeatherOracle {
    function getFinalWeather() external view returns(uint, uint);
    function lastAggregatedRound() external view returns(uint);
}

contract CropInsurance {
    address public farmer;
    address public oracle;
    uint public thresholdRainfall;
    bool public paid;
    uint public lastProcessedRound;
    uint public lastPayoutAmount;

    event PolicyChecked(uint indexed round, uint rainfall, uint threshold, bool paidOut, uint payoutAmount);

    constructor(address _oracle, uint _thresholdRainfall) payable {
        farmer = msg.sender;
        oracle = _oracle;
        thresholdRainfall = _thresholdRainfall;
        paid = false;
    }

    function checkAndPay() public {
        require(!paid, "Already paid");

        uint aggregatedRound = IWeatherOracle(oracle).lastAggregatedRound();
        require(aggregatedRound > 0, "No aggregated weather yet");
        require(aggregatedRound > lastProcessedRound, "Round already processed");

        (, uint rainfall) = IWeatherOracle(oracle).getFinalWeather();
        lastProcessedRound = aggregatedRound;

        if(rainfall < thresholdRainfall) {
            paid = true;
            uint payout = address(this).balance;
            lastPayoutAmount = payout;
            payable(farmer).transfer(payout);
            emit PolicyChecked(aggregatedRound, rainfall, thresholdRainfall, true, payout);
            return;
        }

        emit PolicyChecked(aggregatedRound, rainfall, thresholdRainfall, false, 0);
    }

    function getPolicyStatus() external view returns (bool, uint, uint, uint, uint) {
        return (paid, thresholdRainfall, lastProcessedRound, address(this).balance, lastPayoutAmount);
    }

    receive() external payable {}
}
