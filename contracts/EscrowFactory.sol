pragma solidity ^0.4.24;

import "./MarketHelper.sol";


contract EscrowFactory is MarketHelper {

  struct Escrow {
    uint amountHeld;
    uint expirationDate;
  }


  event LogEscrowCreatedForProduct(uint productId);
  event LogEscrowExpirationDateSetForProduct(uint productId);
  event LogEscrowWithdrawnForProduct(uint productId, address to);


  uint public conflictPeriod = 3 days;

  Escrow[] public escrows;
  mapping(uint => uint) public productToEscrow;


  function withdrawToVendorAfterExpirationDate(uint productId) 
    public 
    onlyVendor(productId) 
    onlyShippedProduct(productId) 
  {
    require(escrows[productToEscrow[productId]].expirationDate < now);

    products[productId].state = State.Received;

    withdraw(productId);
  }

  function withdrawToVendor(uint productId) public onlyVendor(productId) onlyReceivedProduct(productId) {
    withdraw(productId);
  }

  function withdrawToCustomer(uint productId) public onlyCustomer(productId) onlyPurchasedProduct(productId) {
    require(escrows[productToEscrow[productId]].expirationDate + conflictPeriod < now);

    withdraw(productId);
  }


  function withdraw(uint productId) internal {
    Escrow storage escrow = escrows[productToEscrow[productId]];

    uint amountToWithdraw = escrow.amountHeld;
    escrow.amountHeld = 0;
    msg.sender.transfer(amountToWithdraw);

    emit LogEscrowWithdrawnForProduct(productId, msg.sender);
  }

  function createEscrowForProduct(uint productId, uint amountHeld) internal {
    uint id = escrows.push(Escrow(amountHeld, 0));
    productToEscrow[productId] = id;

    emit LogEscrowCreatedForProduct(productId);
  }

  function setProductEscrowExpirationDate(uint productId, uint guaranteedShippingTime) internal {
    require(guaranteedShippingTime != 0);

    escrows[productToEscrow[productId]].expirationDate = now + guaranteedShippingTime + conflictPeriod;

    emit LogEscrowExpirationDateSetForProduct(productId);
  }

}