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
    uint id;
    address vendor;
    address customer;
    string name;
    uint price;
    uint guaranteedShippingTime;
    State state;
  }


  event LogProductListed(uint productId, address indexed vendor);
  

  Product[] public products;
  mapping(address => uint) public vendorProductCount;
  mapping(address => uint) public customerProductCount;


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


  function getNumOfProducts() external view returns (uint) {
    return products.length;
  }

  function getProductsByVendor(address vendor) external view returns (uint[]) {
    uint[] memory productIds = new uint[](vendorProductCount[vendor]);
    uint counter = 0;

    for (uint i = 0; i < products.length; i++) {
      if (products[i].vendor == vendor) {
        productIds[counter] = i;
        counter++;
      }
    }

    return productIds;
  }

  function getProductsByCustomer(address customer) external view returns (uint[]) {
    uint[] memory productIds = new uint[](vendorProductCount[customer]);
    uint counter = 0;

    for (uint i = 0; i < products.length; i++) {
      if (products[i].customer == customer) {
        productIds[counter] = i;
        counter++;
      }
    }

    return productIds;
  }

  function createListing(string name, uint price, uint guaranteedShippingTime) public {
    require(bytes(name).length < 80);

    uint id = products.length;
    products.push(Product(
      id,
      msg.sender,
      0,
      name,
      price,
      guaranteedShippingTime, 
      State.New
    ));
    vendorProductCount[msg.sender]++;

    emit LogProductListed(id, msg.sender);
  }

}