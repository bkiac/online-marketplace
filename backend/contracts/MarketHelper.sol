pragma solidity ^0.4.24;

import "zeppelin/ownership/Ownable.sol";


contract MarketHelper is Ownable {

  enum State {
    New,
    Purchased,
    Shipped,
    Received
  }


  struct Product {
    string name;
    uint price;
    address vendor;
    address customer;
    uint64 id;
    uint8 guaranteedShippingTime;
    State state;
  }


  event LogProductListed(uint productId, address indexed vendor);


  uint public numOfProducts = 0;
  mapping(uint => Product) public products;


  modifier onlyVendor(uint id) {
    require(msg.sender == products[id].vendor);
    _;
  }

  modifier onlyCustomer(uint id) {
    require(msg.sender == products[id].customer);
    _;
  }

  modifier onlyNewProduct(uint id) {
    require(products[id].state == State.New);
    _;
  }

  modifier onlyPurchasedProduct(uint id) {
    require(products[id].state == State.Purchased);
    _;
  }

  modifier onlyShippedProduct(uint id) {
    require(products[id].state == State.Shipped);
    _;
  }

  modifier onlyReceivedProduct(uint id) {
    require(products[id].state == State.Received);
    _;
  }

  modifier onlyShippedOrReceivedProduct(uint id) {
    require(products[id].state == State.Shipped || products[id].state == State.Received);
    _;
  }

  function createListing(string name, uint256 price, uint8 guaranteedShippingTime) public {
    require(bytes(name).length < 80);

    uint64 id = uint64(numOfProducts);

    products[id] = Product(
      name,
      price,
      msg.sender,
      0,
      id,
      guaranteedShippingTime,
      State.New
    );
    
    numOfProducts++;

    emit LogProductListed(id, msg.sender);
  }

}