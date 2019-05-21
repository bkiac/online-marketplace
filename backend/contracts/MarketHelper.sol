pragma solidity ^0.5.8;

import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title MarketHelper
 * @author Bence Knáb
 * @notice This is a wrapper contract for the application, to store product data and common
 * modifiers.
 */
contract MarketHelper is Pausable, Ownable {

  using SafeMath for uint256;


  enum State {
    New,
    Purchased,
    Shipped,
    Received,
    Flagged,
    Resolved
  }


  struct Product {
    string name;
    uint256 price;
    uint256 id;
    uint256 guaranteedShippingTime;
    uint256 dateOfPurchase;
    uint256 dateOfShipping;
    State state;
    address payable vendor;
    address payable customer;
  }


  uint256 public conflictPeriod = 3 minutes;
  
  uint256 public numOfProducts;
  mapping(uint256 => Product) public products;


  /** 
   * @dev Modifier throws if `msg.sender` is not the product's vendor.
   * @param id Product ID
   */
  modifier onlyVendor(uint256 id) {
    require(msg.sender == products[id].vendor, "You are not the vendor of this product!");
    _;
  }

  /** 
   * @dev Modifier throws if `msg.sender` is not the product's customer.
   * @param id Product ID
   */
  modifier onlyCustomer(uint256 id) {
    require(msg.sender == products[id].customer, "You are not the customer of this product!");
    _;
  }

  /** 
   * @dev Modifier throws if the product is not in `New` state.
   * @param id Product ID
   */
  modifier onlyNewProduct(uint256 id) {
    require(products[id].state == State.New, "This is product is not in New state!");
    _;
  }

  /** 
   * @dev Modifier throws if the product is not in `Purchased` state.
   * @param id Product ID
   */
  modifier onlyPurchasedProduct(uint256 id) {
    require(products[id].state == State.Purchased, "This product is not in Purchased state!");
    _;
  }

  /** 
   * @dev Modifier throws if the product is not in `Shipped` state.
   * @param id Product ID
   */
  modifier onlyShippedProduct(uint256 id) {
    require(products[id].state == State.Shipped, "This product is not in Shipped state!");
    _;
  }

  /** 
   * @dev Modifier throws if the product is not in `Received` state.
   * @param id Product ID
   */
  modifier onlyReceivedProduct(uint256 id) {
    require(products[id].state == State.Received, "This product is not in Received state!");
    _;
  }

  /** 
   * @dev Modifier throws if the product is not in `Flagged` state.
   * @param id Product ID
   */
  modifier onlyFlaggedProduct(uint256 id) {
    require(products[id].state == State.Flagged, "This product is not in Flagged state!");
    _;
  }

}
