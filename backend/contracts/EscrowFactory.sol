pragma solidity ^0.4.24;

import "./EscrowHelper.sol";


contract EscrowFactory is EscrowHelper {

  struct Escrow {
    uint amountHeld;
    uint expirationDate;
  }


  event LogEscrowCreatedForProduct(uint productId);
  event LogEscrowExpirationDateSetForProduct(uint productId);
  event LogEscrowWithdrawnForProduct(uint productId, address to);

  uint numOfEscrows;
  mapping(uint => Escrow) public escrows;


  function setEscrowExpirationDateForTest(uint productId, uint date) 
    external
    onlyOwner
    onlyDevelopmentMode
  {
    escrows[productId].expirationDate = date;
  }

  function withdrawTo(uint productId, address to) external onlyOwner {
    Escrow storage escrow = escrows[productId];

    uint amountToWithdraw = escrow.amountHeld;
    escrow.amountHeld = 0;
    to.transfer(amountToWithdraw);

    emit LogEscrowWithdrawnForProduct(productId, msg.sender);
  }

  // @notice Customer can withdraw their funds from the escrow if the vendor doesn't ship the
  // the product in time.
  function withdrawToCustomer(uint productId) 
    public
    onlyCustomer(productId) 
    onlyPurchasedProduct(productId) 
  {
    require(now > products[productId].dateOfPurchase + conflictPeriod);

    withdraw(productId);
  }

  // @notice Vendor can withdraw their funds after their guaranteed shipping time + confict period
  // if they had shipped the product and the customer didn't flag their shipment.
  function withdrawToVendorAfterExpirationDate(uint productId) 
    public 
    onlyVendor(productId) 
    onlyShippedProduct(productId) 
  {
    require(now > escrows[productId].expirationDate + conflictPeriod);

    products[productId].state = State.Received;

    withdraw(productId);
  }

  // @notice Vendor can withdraw their funds if the customer confirms that they have received
  // the shipment.
  function withdrawToVendor(uint productId) 
    public 
    onlyVendor(productId)
    onlyReceivedProduct(productId) 
  {
    withdraw(productId);
  }

  function withdraw(uint productId) internal {
    Escrow storage escrow = escrows[productId];

    uint amountToWithdraw = escrow.amountHeld;
    escrow.amountHeld = 0;
    msg.sender.transfer(amountToWithdraw);

    emit LogEscrowWithdrawnForProduct(productId, msg.sender);
  }

  function createEscrowForProduct(uint productId) internal {
    escrows[productId] = Escrow(products[productId].price, 0);

    emit LogEscrowCreatedForProduct(productId);
  }

  function setEscrowExpirationDate(uint productId) internal {
    require(escrows[productId].expirationDate == 0);

    uint guaranteedShippingTime = products[productId].guaranteedShippingTime;
    escrows[productId].expirationDate = now + guaranteedShippingTime + conflictPeriod;

    emit LogEscrowExpirationDateSetForProduct(productId);
  }

}
