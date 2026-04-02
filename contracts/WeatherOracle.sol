// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WeatherOracle {
    address public owner;
    uint public currentRound;
    uint public lastAggregatedRound;

    struct OracleNode {
        bool authorized;
        uint reputation;
    }

    mapping(address => OracleNode) public nodes;

    struct WeatherData {
        uint temperature;
        uint rainfall;
    }

    WeatherData[] public submissions;
    WeatherData public finalWeather;
    mapping(uint => WeatherData) public roundWeather;
    mapping(uint => mapping(address => bool)) public hasSubmittedInRound;

    event NodeRegistered(address indexed node);
    event WeatherSubmitted(uint indexed round, address indexed node, uint temperature, uint rainfall);
    event WeatherAggregated(uint indexed round, uint temperature, uint rainfall, uint submissionCount);

    constructor() {
        owner = msg.sender;
        currentRound = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner allowed");
        _;
    }

    modifier onlyAuthorized() {
        require(nodes[msg.sender].authorized, "Not authorized node");
        _;
    }

    function registerNode(address node) public onlyOwner {
        require(node != address(0), "Invalid node address");
        nodes[node] = OracleNode(true, 100);
        emit NodeRegistered(node);
    }

    function submitWeather(uint temp, uint rain) public onlyAuthorized {
        require(!hasSubmittedInRound[currentRound][msg.sender], "Node already submitted in this round");
        hasSubmittedInRound[currentRound][msg.sender] = true;
        submissions.push(WeatherData(temp, rain));
        emit WeatherSubmitted(currentRound, msg.sender, temp, rain);
    }

    function aggregateMedian() public onlyOwner {
        require(submissions.length >= 3, "Need minimum 3 submissions");
        uint roundToAggregate = currentRound;

        uint[] memory temps = new uint[](submissions.length);
        uint[] memory rains = new uint[](submissions.length);

        for(uint i=0; i<submissions.length; i++){
            temps[i] = submissions[i].temperature;
            rains[i] = submissions[i].rainfall;
        }

        // sort temps
        for(uint i=0; i<temps.length; i++){
            for(uint j=0; j<temps.length-1; j++){
                if(temps[j] > temps[j+1]){
                    uint t = temps[j];
                    temps[j] = temps[j+1];
                    temps[j+1] = t;
                }
            }
        }

        // sort rains
        for(uint i=0; i<rains.length; i++){
            for(uint j=0; j<rains.length-1; j++){
                if(rains[j] > rains[j+1]){
                    uint r = rains[j];
                    rains[j] = rains[j+1];
                    rains[j+1] = r;
                }
            }
        }

        uint mid = temps.length / 2;
        finalWeather = WeatherData(temps[mid], rains[mid]);
        roundWeather[roundToAggregate] = finalWeather;
        lastAggregatedRound = roundToAggregate;

        emit WeatherAggregated(roundToAggregate, finalWeather.temperature, finalWeather.rainfall, submissions.length);

        delete submissions;
        currentRound += 1;
    }

    function getFinalWeather() public view returns(uint, uint) {
        return (finalWeather.temperature, finalWeather.rainfall);
    }

    function getRoundWeather(uint round) public view returns(uint, uint) {
        WeatherData memory data = roundWeather[round];
        return (data.temperature, data.rainfall);
    }

    function getSubmissionCount() public view returns (uint) {
        return submissions.length;
    }

    function getSubmissionAt(uint index) external view returns (uint, uint) {
        require(index < submissions.length, "Submission index out of range");
        WeatherData memory data = submissions[index];
        return (data.temperature, data.rainfall);
    }

    function isNodeAuthorized(address node) external view returns (bool) {
        return nodes[node].authorized;
    }
}
