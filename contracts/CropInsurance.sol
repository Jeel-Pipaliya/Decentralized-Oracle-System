// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWeatherOracle {
    function getFinalWeather() external view returns(uint, uint);
}

contract CropInsurance {
    address public farmer;
    address public oracle;
    uint public thresholdRainfall;
    bool public paid;

    constructor(address _oracle, uint _thresholdRainfall) payable {
        farmer = msg.sender;
        oracle = _oracle;
        thresholdRainfall = _thresholdRainfall;
        paid = false;
    }

    function checkAndPay() public {
        require(!paid, "Already paid");

        (, uint rainfall) = IWeatherOracle(oracle).getFinalWeather();

        if(rainfall < thresholdRainfall) {
            paid = true;
            payable(farmer).transfer(address(this).balance);
        }
    }

    receive() external payable {}
}
