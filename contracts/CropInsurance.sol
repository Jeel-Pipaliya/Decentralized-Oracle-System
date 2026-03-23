// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWeatherOracle {
    function getFinalWeather() external view returns(uint, uint);
}

contract CropInsurance {
    address public oracle;
    uint public thresholdRainfall;
    
    struct Farmer {
        string name;
        string location;
        uint insuranceAmount;
        bool registered;
        bool paid;
    }

    mapping(address => Farmer) public farmers;
    address[] public farmerAddresses;

    event FarmerRegistered(address indexed farmer, string name, string location, uint amount);
    event PayoutTriggered(address indexed farmer, uint amount);

    constructor(address _oracle, uint _thresholdRainfall) payable {
        oracle = _oracle;
        thresholdRainfall = _thresholdRainfall;
    }

    function registerFarmer(string memory _name, string memory _location, uint _insuranceAmount) public {
        require(!farmers[msg.sender].registered, "Farmer already registered");
        require(_insuranceAmount > 0, "Invalid insurance amount");
        
        farmers[msg.sender] = Farmer({
            name: _name,
            location: _location,
            insuranceAmount: _insuranceAmount,
            registered: true,
            paid: false
        });
        farmerAddresses.push(msg.sender);

        emit FarmerRegistered(msg.sender, _name, _location, _insuranceAmount);
    }

    function checkAndPay() public {
        (, uint rainfall) = IWeatherOracle(oracle).getFinalWeather();

        if (rainfall < thresholdRainfall) {
            for (uint i = 0; i < farmerAddresses.length; i++) {
                address farmerAddr = farmerAddresses[i];
                if (farmers[farmerAddr].registered && !farmers[farmerAddr].paid) {
                    uint payout = farmers[farmerAddr].insuranceAmount;
                    if (address(this).balance >= payout) {
                        farmers[farmerAddr].paid = true;
                        payable(farmerAddr).transfer(payout);
                        emit PayoutTriggered(farmerAddr, payout);
                    }
                }
            }
        }
    }

    // function to allow the contract to receive ETH for payouts
    receive() external payable {}
}
