// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract OracleContract {
address public oracle=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
string public finalResult;
bool public finalized;
constructor(address _oracle) {
    oracle = _oracle;
}
modifier onlyOracle() {
    require(msg.sender == oracle, "Only oracle can submit");
    _;
}
function submitResult(string memory _result) public onlyOracle {
require(!finalized, "Result already locked");
finalResult = _result;
finalized = true;
}
}