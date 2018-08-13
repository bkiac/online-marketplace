pragma solidity ^0.4.24;

import "./EscrowFactory.sol";


contract Market is EscrowFactory {

  event LogProductPurchased(uint256 id, address vendor, address customer);
  event LogProductShipped(uint256 id, address vendor, address customer);
  event LogProductReceived(uint256 id, address vendor, address customer);


  function purchaseProduct(uint256 id) public payable onlyNewProduct(id) {
    require(msg.value >= products[id].price, "Sent ether is lower than the price of the product!");
    require(msg.sender != products[id].vendor, "You are the vendor of this product!");

    Product storage purchasedProduct = products[id];
    purchasedProduct.state = State.Purchased;
    purchasedProduct.customer = msg.sender;
    purchasedProduct.dateOfPurchase = now;

    createEscrowForProduct(id);

    msg.sender.transfer(msg.value.sub(purchasedProduct.price));

    emit LogProductPurchased(id, purchasedProduct.vendor, msg.sender);
  }

  function shipProduct(uint256 id) public onlyVendor(id) onlyPurchasedProduct(id) {
    Product storage shippedProduct = products[id];
    shippedProduct.state = State.Shipped;

    setEscrowExpirationDate(id);

    emit LogProductShipped(id, msg.sender, shippedProduct.customer);
  }

  function flagProduct(uint256 id) public onlyShippedProduct(id) {
    // TODO: if customer hasn't received their purchased product: ...
  }

}
