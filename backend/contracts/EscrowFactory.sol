pragma solidity ^0.5.8;

import "./MarketHelper.sol";


/**
 * @title EscrowFactory
 * @author Bence Knáb
 * @notice This contract is responsible for escrow management.
 */
contract EscrowFactory is MarketHelper {

  struct Escrow {
    uint256 amountHeld;
    uint256 expirationDate;
  }


  mapping(uint256 => Escrow) public escrows;


  event LogEscrowCreatedForProduct(uint256 productId);
  event LogEscrowExpirationDateSetForProduct(uint256 productId);
  event LogEscrowWithdrawnForProduct(uint256 productId, address to);


  /**
   * @notice Customer can withdraw their funds from the escrow if the vendor doesn't ship the 
   * product in time.
   * @dev The state is set to Resolved to signal that the escrow has been withdrawn.
   * @param productId Product ID
   */
  function withdrawToCustomer(uint256 productId) 
    external
    onlyCustomer(productId) 
    onlyPurchasedProduct(productId) 
  {
    require(
      now > products[productId].dateOfPurchase.add(conflictPeriod),
      "The conflict period hasn't expired yet!"
    );

    products[productId].state = State.Resolved;

    withdraw(productId);
  }

  /**
   * @notice Vendor can withdraw funds after the guaranteed shipping time and the conflict period 
   * has passed, if the customer didn't flag their shipment for failed delivery.
   * @param productId Product ID
   */
  function withdrawToVendorAfterExpirationDate(uint256 productId) 
    external 
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

  /**
   * @notice Vendor can withdraw the funds if the customer has confirmed that they received the
   * shipment.
   * @param productId Product ID
   */
  function withdrawToVendor(uint256 productId) 
    external 
    onlyVendor(productId)
    onlyReceivedProduct(productId) 
  {
    withdraw(productId);
  }

  /**
   * @notice Contract owner can withdraw from the escrow to either the vendor's or customer's
   * address.
   * @dev Allows funds to be sent to `address(0)` if the customer hasn't been set yet.
   * @param productId Product ID
   * @param to Address to transfer the funds
   */
  function withdrawTo(uint256 productId, address payable to) 
    internal
    onlyOwner
  {
    require(
      to == products[productId].vendor || to == products[productId].customer,
      "You can only withdraw to the product customer or vendor!"
    );
    require(
      escrows[productId].amountHeld != 0, 
      "The funds from this escrow has already been withdrawn!"
    );
    
    Escrow storage escrow = escrows[productId];

    uint256 amountToWithdraw = escrow.amountHeld;
    escrow.amountHeld = 0;
    to.transfer(amountToWithdraw);

    emit LogEscrowWithdrawnForProduct(productId, to);
  }

  /**
   * @dev Internal function to create an escrow for a product after purchase. Escrows are stored in
   * a productId -> Escrow mapping for easy look up.
   * @param productId Product ID
   */
  function createEscrowForProduct(uint256 productId) internal {
    escrows[productId] = Escrow(products[productId].price, 0);

    emit LogEscrowCreatedForProduct(productId);
  }

  /**
   * @dev Internal function to set an escrow's expiration date after the product has been shipped.
   * @param productId Product ID
   */
  function setEscrowExpirationDate(uint256 productId) internal {
    require(escrows[productId].expirationDate == 0, "The expiration date must still be zero!");

    // guaranteedShippingTime
    uint256 gts = products[productId].guaranteedShippingTime;

    escrows[productId].expirationDate = now.add(gts).add(conflictPeriod);

    emit LogEscrowExpirationDateSetForProduct(productId);
  }

  /**
   * @dev Internal function to withdraw funds from an escrow. Fails if the funds from the escrow
   * has already been withdrawn.
   * @param productId Product ID
   */
  function withdraw(uint256 productId) private whenNotPaused {
    require(
      escrows[productId].amountHeld != 0, 
      "The funds from this escrow has already been withdrawn!"
    );

    Escrow storage escrow = escrows[productId];

    uint256 amountToWithdraw = escrow.amountHeld;
    escrow.amountHeld = 0;
    msg.sender.transfer(amountToWithdraw);

    emit LogEscrowWithdrawnForProduct(productId, msg.sender);
  }

}
