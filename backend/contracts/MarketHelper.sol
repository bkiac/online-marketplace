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

  function createListing(string name, uint price, uint guaranteedShippingTime) public {
    require(bytes(name).length < 80);

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