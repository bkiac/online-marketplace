pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";


// TODO: set default settings to prod
contract Testable is Pausable {

  bool public isDevelopmentMode = true;
  uint256 public conflictPeriod = 3 minutes;


  event LogDevelopmentMode();
  event LogProductionMode();


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
