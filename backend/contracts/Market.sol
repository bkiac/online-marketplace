pragma solidity ^0.4.24;

import "./EscrowFactory.sol";


contract Market is EscrowFactory {

  event LogProductListed(uint256 id, address vendor);
  event LogProductPurchased(uint256 id, address vendor, address customer);
  event LogProductShipped(uint256 id, address vendor, address customer);
  event LogProductReceived(uint256 id, address vendor, address customer);
  event LogProductFlagged(uint256 id, address vendor, address customer);
  event LogProductDisputeResolved(uint256 id, address inFavor);


  function createProductListing(string name, uint256 price, uint256 guaranteedShippingTime) 
    external
  {
    require(bytes(name).length < 80, "This product name is too long!");

    uint256 id = numOfProducts;
    products[id] = Product(
      name,
      price,
      id,
      guaranteedShippingTime,
      0,
      0,
      State.New,
      msg.sender,
      0
    );

    numOfProducts = numOfProducts.add(1);

    emit LogProductListed(id, msg.sender);
  }

  function purchaseProduct(uint256 id) external payable onlyNewProduct(id) whenNotPaused {
    require(msg.value >= products[id].price, "Sent ether is lower than the price of the product!");
    require(msg.sender != products[id].vendor, "You are the vendor of this product!");

    Product storage product = products[id];
    product.state = State.Purchased;
    product.customer = msg.sender;
    product.dateOfPurchase = now;

    createEscrowForProduct(id);

    msg.sender.transfer(msg.value.sub(product.price));

    emit LogProductPurchased(id, product.vendor, msg.sender);
  }

  function shipProduct(uint256 id) external onlyVendor(id) onlyPurchasedProduct(id) {   
    Product storage product = products[id];
    product.state = State.Shipped;
    product.dateOfShipping = now;

    setEscrowExpirationDate(id);

    emit LogProductShipped(id, msg.sender, products[id].customer);
  }

  function receiveProduct(uint256 id) external onlyCustomer(id) onlyShippedProduct(id) {
    Product storage product = products[id];
    product.state = State.Received;

    emit LogProductReceived(id, msg.sender, product.customer);
  }

  function flagProduct(uint256 id) external onlyCustomer(id) onlyShippedProduct(id) {
    require(
      escrows[id].expirationDate.sub(conflictPeriod) < now,
      "You can't flag this product yet!"
    );
    require(
      escrows[id].expirationDate > now,
      "You can't flag this product anymore!"
    );

    Product storage product = products[id];
    product.state = State.Flagged;

    emit LogProductFlagged(id, msg.sender, product.customer);
  }

  function resolveDispute(uint256 id, address inFavor) external onlyOwner onlyFlaggedProduct(id) {
    require(
      inFavor == products[id].vendor || inFavor == products[id].customer,
      "You can only resolve the dispute in favor of the vendor or the customer!"
    );

    Product storage product = products[id];
    product.state = State.Resolved;
    
    emit LogProductDisputeResolved(id, inFavor);
  }

}
