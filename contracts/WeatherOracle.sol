// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WeatherOracle {
    address public owner;

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

    constructor() {
        owner = msg.sender;
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
        nodes[node] = OracleNode(true, 100);
    }

    function submitWeather(uint temp, uint rain) public onlyAuthorized {
        submissions.push(WeatherData(temp, rain));
    }

    function aggregateMedian() public onlyOwner {
        require(submissions.length >= 3, "Need minimum 3 submissions");

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

        delete submissions;
    }

    function getFinalWeather() public view returns(uint, uint) {
        return (finalWeather.temperature, finalWeather.rainfall);
    }
}
