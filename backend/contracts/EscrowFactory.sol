pragma solidity ^0.4.24;

import "./MarketHelper.sol";


contract EscrowFactory is MarketHelper {

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

  // @notice Contract owner can resolve disputes and transfer the funds to their preferred 
  // recipient. Allows the funds to be sent to `address(0)` if the customer hasn't been set yet.
  function withdrawTo(uint256 productId, address to) external onlyOwner {
    require(
      to == products[productId].vendor || to == products[productId].customer,
      "You can only withdraw to the product customer or vendor!"
    );
    
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

  function withdraw(uint256 productId) internal whenNotPaused {
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

    // guaranteedShippingTime
    uint256 gts = products[productId].guaranteedShippingTime;

    if (isDevelopmentMode) {
      escrows[productId].expirationDate = now.add(gts.mul(1 minutes)).add(conflictPeriod);
    } else {
      escrows[productId].expirationDate = now.add(gts.mul(1 days)).add(conflictPeriod);
    }

    emit LogEscrowExpirationDateSetForProduct(productId);
  }

}
