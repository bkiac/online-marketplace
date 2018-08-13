pragma solidity ^0.4.24;

import "./EscrowHelper.sol";


contract EscrowFactory is EscrowHelper {

  struct Escrow {
    uint256 amountHeld;
    uint256 expirationDate;
  }


  event LogEscrowCreatedForProduct(uint256 productId);
  event LogEscrowExpirationDateSetForProduct(uint256 productId);
  event LogEscrowWithdrawnForProduct(uint256 productId, address to);

  uint256 numOfEscrows;
  mapping(uint256 => Escrow) public escrows;


  function setEscrowExpirationDateForTest(uint256 productId, uint256 date) 
    external
    onlyOwner
    onlyDevelopmentMode
  {
    escrows[productId].expirationDate = date;
  }

  function withdrawTo(uint256 productId, address to) external onlyOwner {
    Escrow storage escrow = escrows[productId];

    uint256 amountToWithdraw = escrow.amountHeld;
    escrow.amountHeld = 0;
    to.transfer(amountToWithdraw);

    emit LogEscrowWithdrawnForProduct(productId, msg.sender);
  }

  // @notice Customer can withdraw their funds from the escrow if the vendor doesn't ship the
  // the product in time.
  function withdrawToCustomer(uint256 productId) 
    public
    onlyCustomer(productId) 
    onlyPurchasedProduct(productId) 
  {
    require(
      now > products[productId].dateOfPurchase.add(conflictPeriod),
      "The conflict period hasn't expired yet!"
    );

    withdraw(productId);
  }

  // @notice Vendor can withdraw their funds after their guaranteed shipping time + confict period
  // if they had shipped the product and the customer didn't flag their shipment.
  function withdrawToVendorAfterExpirationDate(uint256 productId) 
    public 
    onlyVendor(productId) 
    onlyShippedProduct(productId) 
  {
    require(
      now > escrows[productId].expirationDate.add(conflictPeriod),
      "The conflict period hasn't expired yet!"
    );

    products[productId].state = State.Received;

    withdraw(productId);
  }

  // @notice Vendor can withdraw their funds if the customer confirms that they have received
  // the shipment.
  function withdrawToVendor(uint256 productId) 
    public 
    onlyVendor(productId)
    onlyReceivedProduct(productId) 
  {
    withdraw(productId);
  }

  function withdraw(uint256 productId) internal {
    Escrow storage escrow = escrows[productId];

    uint256 amountToWithdraw = escrow.amountHeld;
    escrow.amountHeld = 0;
    msg.sender.transfer(amountToWithdraw);

    emit LogEscrowWithdrawnForProduct(productId, msg.sender);
  }

  function createEscrowForProduct(uint256 productId) internal {
    escrows[productId] = Escrow(products[productId].price, 0);

    emit LogEscrowCreatedForProduct(productId);
  }

  function setEscrowExpirationDate(uint256 productId) internal {
    require(escrows[productId].expirationDate == 0, "The expiration date must still be zero!");

    uint256 guaranteedShippingTime = products[productId].guaranteedShippingTime;
    escrows[productId].expirationDate = now.add(guaranteedShippingTime).add(conflictPeriod);

    emit LogEscrowExpirationDateSetForProduct(productId);
  }

}
