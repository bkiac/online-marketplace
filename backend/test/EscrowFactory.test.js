const moment = require('moment');
const { StateEnum } = require('./util/StateEnum');
const { expectThrow } = require('./util/expectThrow');
const { convertProduct, convertEscrow } = require('./util/structs');

const Market = artifacts.require('Market');

// Test withdraw methods
// TODO: how to test exact withdrawal amount?
contract('EscrowFactory', function (accounts) {
  let market;

  const vendor = accounts[1];
  const customer = accounts[2];
  const randomAddress = accounts[3];

  const testProduct = {
    id: 0,
    name: 'Test Product',
    price: web3.toWei(1, 'ether'),
    guaranteedShippingTime: moment.duration(3, 'days').asSeconds(),
  };


  beforeEach(async function () {
    market = await Market.new();

    await market.setDevelopmentMode();

    const { id, name, price, guaranteedShippingTime } = testProduct;
    await market.createProductListing(name, price, guaranteedShippingTime, { from: vendor });
    await market.purchaseProduct(id, { from: customer, value: price });
  });

  describe('Customer withdrawals', function () {
    it('should allow the customer to withdraw', async function () {
      const { id, price } = testProduct;

      // Set the new purchase date to `currentTime - 4min`, then the conflict period has ended.
      // `(currentTime - 4min) + 3min = currentTime - 1min < block.timestamp`, 
      const newPurchaseDate = moment().subtract(4, 'minutes').unix();
      await market.setProductDateOfPurchaseForTest(id, newPurchaseDate);

      const balanceBefore = web3.eth.getBalance(customer);
      await market.withdrawToCustomer(id, { from: customer });
      const balanceAfter = web3.eth.getBalance(customer);
      const product = convertProduct(await market.products(id));
      const escrow = convertEscrow(await market.escrows(id));

      assert.isAbove(balanceAfter.toNumber(), balanceBefore.toNumber());

      assert.equal(product.state, StateEnum.Resolved);

      assert.equal(escrow.amountHeld, 0);
    });
  
    it('should only allow the customer to withdraw', async function () {
      const { id } = testProduct;

      const newPurchaseDate = moment().subtract(4, 'minutes').unix();
      await market.setProductDateOfPurchaseForTest(id, newPurchaseDate);

      await expectThrow(
        market.withdrawToCustomer(id, { from: randomAddress })
      );
    });

    it('should not allow withdrawal before the conflict period expired', async function () {
      const { id } = testProduct;

      // Set the new purchase date to `currentTime`, therefore
      // `block.timestamp < currentTime + 3min`, and the inital conflict period hasn't ended yet.
      const newPurchaseDate = moment().unix();
      await market.setProductDateOfPurchaseForTest(id, newPurchaseDate);

      await expectThrow(
        market.withdrawToCustomer(id, { from: customer })
      );
    });
  });

  describe('Vendor withdrawals', function () {
    beforeEach(async function () {
      const { id } = testProduct;

      await market.shipProduct(id, { from: vendor });
    });

    describe('After expiration date', function () {
      it('should allow the vendor to withdraw', async function () {
        const { id } = testProduct;

        // Set the new expiration date to `currentTime - 4min`, therefore
        // `(currentTime - 4min) +3min = currentTime - 1min < block.timestamp`, 
        // and the expiration date has already expired.
        const newExpirationDate = moment().subtract(4, 'minutes').unix();
        await market.setEscrowExpirationDateForTest(id, newExpirationDate);

        const balanceBefore = web3.eth.getBalance(vendor);
        await market.withdrawToVendorAfterExpirationDate(id, { from: vendor });
        const balanceAfter = web3.eth.getBalance(vendor);
        const product = convertProduct(await market.products(id));
        const escrow = convertEscrow(await market.escrows(id));
  
        assert.isAbove(balanceAfter.toNumber(), balanceBefore.toNumber());
  
        assert.equal(product.state, StateEnum.Received);
  
        assert.equal(escrow.amountHeld, 0);
      });

      it('should only allow vendor to withdraw', async function () {
        const { id } = testProduct;

        const newExpirationDate = moment().subtract(4, 'minutes').unix();
        await market.setEscrowExpirationDateForTest(id, newExpirationDate);

        await expectThrow(
          market.withdrawToVendorAfterExpirationDate(id, { from: randomAddress })
        );
      });

      it('should not allow withdrawal before the escrow expired', async function () {
        const { id } = testProduct;

        // Set the new expiration date to `currentTime`, therefore
        // `block.timestamp < currentTime + 3min`, and the escrow still needs 3 minutes to expire.
        const newExpirationDate = moment().unix();
        await market.setEscrowExpirationDateForTest(id, newExpirationDate);

        await expectThrow(
          market.withdrawToVendorAfterExpirationDate(id, { from: vendor })
        );
      });
    });

    describe('After product was received', function () {
      beforeEach(async function () {
        const { id } = testProduct;
        await market.receiveProduct(id, { from: customer });
      });

      it('should allow the vendor to withdraw', async function () {
        const { id } = testProduct;

        const balanceBefore = web3.eth.getBalance(vendor);
        await market.withdrawToVendor(id, { from: vendor });
        const balanceAfter = web3.eth.getBalance(vendor);
        const escrow = convertEscrow(await market.escrows(id));
  
        assert.isAbove(balanceAfter.toNumber(), balanceBefore.toNumber());
  
        assert.equal(escrow.amountHeld, 0);
      });

      it('should only allow the vendor to withdraw', async function () {
        const { id } = testProduct;

        await expectThrow(
          market.withdrawToVendor(id, { from: randomAddress })
        );
      });
    });
  });

  describe('General withdrawals', function () {
    beforeEach(async function () {
      const { id } = testProduct;
      await market.shipProduct(id, { from: vendor });
      await market.receiveProduct(id, { from: customer });
    });

    it('should not allow to withdraw twice from the same escrow', async function () {
      const { id } = testProduct;

      await market.withdrawToVendor(id, { from: vendor });
      await expectThrow(
        market.withdrawToVendor(id, { from: vendor })
      );
    });
  });
});
