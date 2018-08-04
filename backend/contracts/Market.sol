pragma solidity ^0.4.24;

import "./EscrowFactory.sol";


contract Market is EscrowFactory {

  event LogProductPurchased(uint id, address indexed vendor, address indexed customer);
  event LogProductShipped(uint id, address indexed vendor, address indexed customer);
  event LogProductReceived(uint id, address indexed vendor, address indexed customer);


  function purchaseProduct(uint id) public payable onlyNewProduct(id) {
    require(msg.value >= products[id].price);
    require(msg.sender != products[id].vendor);

    Product storage purchasedProduct = products[id];
    purchasedProduct.state = State.Purchased;

    purchasedProduct.customer = msg.sender;
    customerProductCount[msg.sender]++;

    createEscrowForProduct(id, purchasedProduct.price);

    msg.sender.transfer(msg.value - purchasedProduct.price);

    emit LogProductPurchased(id, purchasedProduct.vendor, msg.sender);
  }

  function shipProduct(uint id) public onlyVendor(id) onlyPurchasedProduct(id) {
    Product storage shippedProduct = products[id];
    shippedProduct.state = State.Shipped;

    setProductEscrowExpirationDate(id, shippedProduct.guaranteedShippingTime);

    emit LogProductShipped(id, msg.sender, shippedProduct.customer);
  }

  function flagProduct(uint id) public onlyShippedProduct(id) {
    // TODO: if customer hasn't received their purchased product: ...
  }

}