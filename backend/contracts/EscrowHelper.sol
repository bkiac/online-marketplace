pragma solidity ^0.4.24;

import "./MarketHelper.sol";


contract EscrowHelper is MarketHelper {

  bool private isDevelopmentMode = true;
  uint256 public conflictPeriod = 3 minutes;


  modifier onlyDevelopmentMode() {
    require(isDevelopmentMode, "This function can only be used in development mode.");
    _;
  }


  function setDevelopmentMode() external onlyOwner {
    isDevelopmentMode = true;
    conflictPeriod = 3 minutes;
  }

  function setProductionMode() external onlyOwner {
    isDevelopmentMode = false;
    conflictPeriod = 3 days;
  }

}
