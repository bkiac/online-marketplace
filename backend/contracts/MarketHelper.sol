pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Testable.sol";

contract MarketHelper is Testable {

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
    address vendor;
    address customer;
  }


  uint256 public numOfProducts;
  mapping(uint256 => Product) public products;


  modifier onlyVendor(uint256 id) {
    require(msg.sender == products[id].vendor, "You are not the vendor of this product!");
    _;
  }

  modifier onlyCustomer(uint256 id) {
    require(msg.sender == products[id].customer, "You are not the customer of this product!");
    _;
  }

  modifier onlyNewProduct(uint256 id) {
    require(products[id].state == State.New, "This is product is not in New state!");
    _;
  }

  modifier onlyPurchasedProduct(uint256 id) {
    require(products[id].state == State.Purchased, "This product is not in Purchased state!");
    _;
  }

  modifier onlyShippedProduct(uint256 id) {
    require(products[id].state == State.Shipped, "This product is not in Shipped state!");
    _;
  }

  modifier onlyReceivedProduct(uint256 id) {
    require(products[id].state == State.Received, "This product is not in Received state!");
    _;
  }

  modifier onlyFlaggedProduct(uint256 id) {
    require(products[id].state == State.Flagged, "This product is not in Flagged state!");
    _;
  }

}
