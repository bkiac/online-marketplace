pragma solidity ^0.4.24;

import "./EscrowFactory.sol";


contract Market is EscrowFactory {

  event LogProductPurchased(uint id, address indexed vendor, address indexed customer);
  event LogProductShipped(uint id, address indexed vendor, address indexed customer);
  event LogProductReceived(uint id, address indexed vendor, address indexed customer);


  function purchaseProduct(uint id) public payable onlyNewProduct(id) {
    require(products[id].price <= msg.value);
    require(productToVendor[id] != msg.sender);

    Product storage purchasedProduct = products[id];
    purchasedProduct.state = State.Purchased;

    productToCustomer[id] = msg.sender;
    customerProductCount[msg.sender]++;

    createEscrowForProduct(id, purchasedProduct.price);

    msg.sender.transfer(msg.value - purchasedProduct.price);

    emit LogProductPurchased(id, productToVendor[id], msg.sender);
  }

  function shipProduct(uint id) public onlyVendor(id) onlyPurchasedProduct(id) {
    Product storage shippedProduct = products[id];
    shippedProduct.state = State.Shipped;

    setProductEscrowExpirationDate(id, shippedProduct.guaranteedShippingTime);

    emit LogProductShipped(id, msg.sender, productToCustomer[id]);
  }

  function flagProduct(uint id) public onlyShippedProduct(id) {
    // TODO: if customer hasn't received their purchased product: ...
  }

}