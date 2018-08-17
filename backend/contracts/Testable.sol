pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";


/**
 * @title Testable
 * @author Bence Knáb
 * @dev This contract allows the contract owner to toggle development / production mode and
 * holds the `conflictPeriod` time.
 */
contract Testable is Pausable {

  bool public isDevelopmentMode = true;
  uint256 public conflictPeriod = 3 minutes;


  event LogDevelopmentMode();
  event LogProductionMode();


  /**
   * @dev Modifier throws if the contract is currently not in development mode.
   */
  modifier onlyDevelopmentMode() {
    require(isDevelopmentMode, "This function can only be used in development mode.");
    _;
  }

    /**
   * @dev The contract owner can turn on development mode, setting `isDevelopmentMode` to `true`,
   * and `conflictPeriod` to 3 minutes;
   */
  function setDevelopmentMode() external onlyOwner {
    isDevelopmentMode = true;
    conflictPeriod = 3 minutes;
  }

    /**
   * @dev The contract owner can turn on production mode, setting `isDevelopmentMode` to `false`,
   * and `conflictPeriod` to 3 days;
   */
  function setProductionMode() external onlyOwner {
    isDevelopmentMode = false;
    conflictPeriod = 3 days;
  }

}
