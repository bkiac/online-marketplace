pragma solidity ^0.4.24;

import "./EscrowFactory.sol";

/**
 * @title Testable
 * @author Bence Knáb
 * @notice This contract allows the contract owner to toggle development / production mode and to
 * manipulate the various date fields.
 */
contract Testable is EscrowFactory {

  bool public isDevelopmentMode = false;


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

  /**
   * @dev This function can only be called by the contract owner in development mode.
   * Allows to manually set the purchase date to test time-dependent methods.
   */
  function setProductDateOfPurchaseForTest(uint256 productId, uint256 date) 
    external
    onlyOwner
    onlyDevelopmentMode
  {
    products[productId].dateOfPurchase = date;
  }

  /**
   * @dev This function can only be called by the contract owner in development mode.
   * Allows to manually set the shipping date to test time-dependent methods.
   */
  function setProductDateOfShippingForTest(uint256 productId, uint256 date) 
    external
    onlyOwner
    onlyDevelopmentMode
  {
    products[productId].dateOfShipping = date;
  }

  /**
   * @dev This function can only be called by the contract owner in development mode.
   * Allows to manually set the expiration date to test time-dependent methods.
   */
  function setEscrowExpirationDateForTest(uint256 productId, uint256 date) 
    external
    onlyOwner
    onlyDevelopmentMode
  {
    escrows[productId].expirationDate = date;
  }

}
