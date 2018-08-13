pragma solidity ^0.4.24;

import "zeppelin/ownership/Ownable.sol";
import "zeppelin/math/SafeMath.sol";

contract MarketHelper is Ownable {

  using SafeMath for uint256;

  enum State {
    New,
    Purchased,
    Shipped,
    Received
  }


  struct Product {
    string name;
    uint price;
    uint id;
    uint guaranteedShippingTime;
    uint dateOfPurchase;
    State state;
    address vendor;
    address customer;
  }


  event LogProductListed(uint productId, address vendor);


  uint public numOfProducts = 0;
  mapping(uint => Product) public products;


  modifier onlyVendor(uint id) {
    require(msg.sender == products[id].vendor, "You are not the vendor of this product!");
    _;
  }

  modifier onlyCustomer(uint id) {
    require(msg.sender == products[id].customer, "You are not the customer of this product!");
    _;
  }

  modifier onlyNewProduct(uint id) {
    require(products[id].state == State.New, "This is product is not in New state!");
    _;
  }

  modifier onlyPurchasedProduct(uint id) {
    require(products[id].state == State.Purchased, "This product is not in Purchased state!");
    _;
  }

  modifier onlyShippedProduct(uint id) {
    require(products[id].state == State.Shipped, "This product is not in Shipped state!");
    _;
  }

  modifier onlyReceivedProduct(uint id) {
    require(products[id].state == State.Received, "This product is not in Received state!");
    _;
  }


  function createListing(string name, uint price, uint guaranteedShippingTime) public {
    require(bytes(name).length < 80, "This product name is too long!");

    uint id = numOfProducts;

    products[id] = Product(
      name,
      price,
      id,
      guaranteedShippingTime,
      0,
      State.New,
      msg.sender,
      0
    );
    
    numOfProducts.add(1);

    emit LogProductListed(id, msg.sender);
  }

}