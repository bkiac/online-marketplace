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
    uint guaranteedShippingTime;
    State state;
  }


  event LogProductListed(uint productId, address indexed vendor);
  

  Product[] public products;
  mapping(uint => address) public productToVendor;
  mapping(address => uint) public vendorProductCount;
  mapping(uint => address) public productToCustomer;
  mapping(address => uint) public customerProductCount;


  modifier onlyVendor(uint id) {
    require(productToVendor[id] == msg.sender);
    _;
  }

  modifier onlyCustomer(uint id) {
    require(productToCustomer[id] == msg.sender);
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


  function getProductsByVendor(address vendor) external view returns (uint[]) {
    uint[] memory productIds = new uint[](vendorProductCount[vendor]);
    uint counter = 0;

    for (uint i = 0; i < products.length; i++) {
      if (productToVendor[i] == vendor) {
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
      if (productToCustomer[i] == customer) {
        productIds[counter] = i;
        counter++;
      }
    }

    return productIds;
  }


  function createListing(string name, uint price, uint guaranteedShippingTime) public {
    require(bytes(name).length < 80);

    uint id = products.push(Product(
      name, 
      price, 
      guaranteedShippingTime, 
      State.New
    ));
    productToVendor[id] = msg.sender;
    vendorProductCount[msg.sender]++;

    emit LogProductListed(id, msg.sender);
  }

}