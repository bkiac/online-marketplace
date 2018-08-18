const moment = require('moment');
const { expectThrow } = require('./util/expectThrow');

const Market = artifacts.require('Market');

contract('Testable', function (accounts) {
  let market;
  const vendor = accounts[1];
  const customer = accounts[2];
  const testProduct = {
    id: 0,
    name: 'Test Product',
    price: web3.toWei(1, 'ether'),
    guaranteedShippingTime: moment.duration(3, 'days').asSeconds(),
  }

  beforeEach(async function () {
    market = await Market.new();
  });

  describe('Development mode', function () {
    it('should be in development mode', async function () {
      await market.setDevelopmentMode();
  
      const isDevelopmentMode = await market.isDevelopmentMode();
      const conflictPeriod = await market.conflictPeriod();
  
      assert.equal(isDevelopmentMode, true);
      assert.equal(conflictPeriod, moment.duration(3, 'minutes').asSeconds());
    });
  
    it('should be in production mode', async function () {
      await market.setProductionMode();
      
      const isDevelopmentMode = await market.isDevelopmentMode();
      const conflictPeriod = await market.conflictPeriod();
  
      assert.equal(isDevelopmentMode, false);
      assert.equal(conflictPeriod, moment.duration(3, 'days').asSeconds());
    });
  });
  
  describe('Setters', function() {
    describe('Purchase date', function () {
      beforeEach(async function () {
        const { id, name, price, guaranteedShippingTime } = testProduct;
  
        await market.createProductListing(name, price, guaranteedShippingTime, { from: vendor });
        await market.purchaseProduct(id, { from: customer, value: price });
      });

      it('should set the date of purchase for the product', async function () {
        const { id } = testProduct;

        await market.setDevelopmentMode();

        /// Set the purchase date to now
        const newPurchaseDate = moment().unix();
        await market.setProductDateOfPurchaseForTest(id, newPurchaseDate);
        const product = await market.products(id);
  
        assert.equal(product[4].toNumber(), newPurchaseDate);
      });
  
      it('should only work in development mode', async function () {
        const { id } = testProduct;
  
        /// Set the purchase date to now
        const newPurchaseDate = moment().unix();
        await expectThrow(
          market.setProductDateOfPurchaseForTest(id, newPurchaseDate),
        );
      });
    });

    describe('Shipping date', function () {
      beforeEach(async function () {
        const { id, name, price, guaranteedShippingTime } = testProduct;
  
        await market.createProductListing(name, price, guaranteedShippingTime, { from: vendor });
        await market.purchaseProduct(id, { from: customer, value: price });
        await market.shipProduct(id, { from: vendor });
      });

      it('should set the date of shipping for the product', async function () {
        const { id } = testProduct;
        
        await market.setDevelopmentMode();

        /// Set the shipping date to now
        const newShippingDate = moment().unix();
        await market.setProductDateOfShippingForTest(id, newShippingDate);
        const product = await market.products(id);
  
        assert.equal(product[4].toNumber(), newShippingDate);
      });
  
      it('should only work in development mode', async function () {
        const { id } = testProduct;

        /// Set the shipping date to now
        const newShippingDate = moment().unix();
        await expectThrow(
          market.setProductDateOfPurchaseForTest(id, newShippingDate),
        );
      });
    });

    describe('Expiration date', function () {
      beforeEach(async function () {
        const { id, name, price, guaranteedShippingTime } = testProduct;
  
        await market.createProductListing(name, price, guaranteedShippingTime, { from: vendor });
        await market.purchaseProduct(id, { from: customer, value: price });
        await market.shipProduct(id, { from: vendor });
      });

      it('should set the expiration date for the escrow', async function () {
        const { id } = testProduct;

        await market.setDevelopmentMode();

        /// Set the expiration date to now
        const newExpirationDate = moment().unix();
        await market.setEscrowExpirationDateForTest(id, newExpirationDate);
        const escrow = await market.escrows(id);
  
        assert.equal(escrow[1].toNumber(), newExpirationDate);
      });
      
      it('should only work in development mode', async function () {
        const { id } = testProduct;
        
        /// Set the expiration date to now
        const newExpirationDate = moment().unix();
        await expectThrow(
          market.setEscrowExpirationDateForTest(id, newExpirationDate),
        );
      });
    });
  });
});
