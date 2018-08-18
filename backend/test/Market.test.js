const moment = require('moment');
const { StateEnum } = require('./util/StateEnum');
const { expectThrow } = require('./util/expectThrow');
const { convertProduct, convertEscrow } = require('./util/structs');

const Market = artifacts.require('Market');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// Valid escrow management (except withdrawals) is also tested here, together with Market methods,
// because they are dependent on each other.
contract('Market', function (accounts) {
  let market;
  const owner = accounts[0];
  const vendor = accounts[1];
  const customer = accounts[2];
  const randomAddress = accounts[3];
  const testProduct = {
    id: 0,
    name: 'Test Product',
    price: web3.toWei(1, 'ether'),
    guaranteedShippingTime: moment.duration(3, 'days').asSeconds(),
  }

  beforeEach(async function () {
    market = await Market.new();
  });

  describe('Listing products', function() {
    it('should create valid new product listing', async function () {
      const { id, name, price, guaranteedShippingTime } = testProduct;
  
      await market.createProductListing(name, price, guaranteedShippingTime, { from: vendor });
      const numOfProducts = await market.numOfProducts();
      const product = convertProduct(await market.products(id));
   
      assert.equal(numOfProducts, 1);
    
      assert.equal(product.name, name);
      assert.equal(product.price, price);
      assert.equal(product.id, id);
      assert.equal(product.guaranteedShippingTime, guaranteedShippingTime);
      assert.equal(product.dateOfPurchase, 0);
      assert.equal(product.dateOfShipping, 0);
      assert.equal(product.state, StateEnum.New);
      assert.equal(product.vendor, vendor);
      assert.equal(product.customer, ZERO_ADDRESS);
    });
  });
  
  describe('Purchasing products', function () {
    beforeEach(async function() {
      const { name, price, guaranteedShippingTime } = testProduct;

      await market.createProductListing(name, price, guaranteedShippingTime, { from: vendor });
    });

    it('should allow purchase and create valid escrow', async function () {
      const { id, price } = testProduct;

      await market.purchaseProduct(id, { from: customer, value: price });
      const product = convertProduct(await market.products(id));
      const escrow = convertEscrow(await market.escrows(id));

      assert.notEqual(product.dateOfPurchase, 0); // assert date of purchase has been changed
      assert.equal(product.state, StateEnum.Purchased);
      assert.equal(product.customer, customer);

      assert.equal(escrow.amountHeld, price); // assert held amount
      assert.equal(escrow.expirationDate, 0); // assert expiration date is still zero
    });

    it('should fail with insufficient funds', async function () {
      const { id } = testProduct;
      const amount = web3.toWei(0.1, 'ether');

      await expectThrow(
        market.purchaseProduct(id, { from: customer, value: amount }),
      );
    });

    it('should not allow the vendor to purchase their own product', async function () {
      const { id, price } = testProduct;

      await expectThrow(
        market.purchaseProduct(id, { from: vendor, value: price }),
      );
    });
  });

  describe('Shipping products', function () {
    beforeEach(async function() {
      const { id, name, price, guaranteedShippingTime } = testProduct;

      await market.createProductListing(name, price, guaranteedShippingTime, { from: vendor });
      await market.purchaseProduct(id, { from: customer, value: price });
    });

    it('should allow shipping and set escrow expiration date', async function () {
      const { id } = testProduct;

      await market.shipProduct(id, { from: vendor });
      const product = convertProduct(await market.products(id));
      const escrow = convertEscrow(await market.escrows(id));

      assert.notEqual(product.dateOfShipping, 0); // assert date of shipping has been changed
      assert.equal(product.state, StateEnum.Shipped);

      assert.notEqual(escrow.expirationDate, 0); // assert expiration date has been changed
    });

    it('should only allow the vendor to ship the product', async function () {
      const { id } = testProduct;

      await expectThrow(
        market.shipProduct(id, { from: randomAddress }),
      );
    });
  });

  describe('Receiving products', function () {
    beforeEach(async function() {
      const { id, name, price, guaranteedShippingTime } = testProduct;

      await market.createProductListing(name, price, guaranteedShippingTime, { from: vendor });
      await market.purchaseProduct(id, { from: customer, value: price });
      await market.shipProduct(id, { from: vendor });
    });

    it('should allow the customer to receive to receive the product', async function () {
      const { id } = testProduct;

      await market.receiveProduct(id, { from: customer });
      const product = convertProduct(await market.products(id));

      assert.equal(product.state, StateEnum.Received);
    });

    it('should only allow the customer to receive the product', async function () {
      const { id } = testProduct;

      await expectThrow(
        market.receiveProduct(id, { from: randomAddress }),
      );
    });
  });

  // To test product flagging methods, the escrow's expiration date will be set manually.
  describe('Flagging products', function () {
    beforeEach(async function() {
      await market.setDevelopmentMode();

      const { id, name, price, guaranteedShippingTime } = testProduct;

      await market.createProductListing(name, price, guaranteedShippingTime, { from: vendor });
      await market.purchaseProduct(id, { from: customer, value: price });
      await market.shipProduct(id, { from: vendor });
    });

    it('should allow the customer to flag the product', async function () {
      const { id } = testProduct;

      // Set the expiration date to `currentTime + 1.5min`, so the function will run in the
      // `currentTime - 1.5min < block.timestamp < currentTime + 1.5min` time window.
      const newExpirationDate = moment().add(1.5, 'minutes').unix();
      await market.setEscrowExpirationDateForTest(id, newExpirationDate);

      await market.flagProduct(id, { from: customer });
      const product = convertProduct(await market.products(id));

      assert.equal(product.state, StateEnum.Flagged); // assert state
    });

    it('should only allow the customer to flag the product', async function () {
      const { id } = testProduct;

      const newExpirationDate = moment().add(1.5, 'minutes').unix();
      await market.setEscrowExpirationDateForTest(id, newExpirationDate);

      await expectThrow(
        market.flagProduct(id, { from: randomAddress })
      );
    });

    it('should not allow the customer to flag the product too soon', async function () {
      const { id } = testProduct;

      // Set the expiration date to `currentTime + 4min`, so the function will fail because 
      // `block.timestamp < (currentTime + 4min) - 3min = currentTime + 1min`, and 1 minute still
      // has to pass to allow product flagging.
      const newExpirationDate = moment().add(4, 'minutes').unix();
      await market.setEscrowExpirationDateForTest(id, newExpirationDate);

      await expectThrow(
        market.flagProduct(id, { from: customer })
      );
    });

    it('should not allow the customer to flag the product too late', async function () {
      const { id } = testProduct;

      // Set the expiration date to `currentTime - 1min`, so the function will fail because 
      // `currentTime - 1min < block.timestamp`, and the expiration date has already expired.
      const newExpirationDate = moment().subtract(1, 'minutes').unix();
      await market.setEscrowExpirationDateForTest(id, newExpirationDate);

      await expectThrow(
        market.flagProduct(id, { from: customer })
      );
    });
  });

  describe('Dispute resolution', function () {
    beforeEach(async function() {
      await market.setDevelopmentMode();

      const { id, name, price, guaranteedShippingTime } = testProduct;

      await market.createProductListing(name, price, guaranteedShippingTime, { from: vendor });
      await market.purchaseProduct(id, { from: customer, value: price });
      await market.shipProduct(id, { from: vendor });
      const newExpirationDate = moment().add(1.5, 'minutes').unix();
      await market.setEscrowExpirationDateForTest(id, newExpirationDate);
      await market.flagProduct(id, { from: customer });
    });

    it('should refund the vendor', async function () {
      const { id, price } = testProduct;

      const balanceBefore = await web3.eth.getBalance(vendor);
      await market.resolveDispute(id, vendor);
      const balanceAfter = await web3.eth.getBalance(vendor);
      const product = convertProduct(await market.products(id));

      assert.equal(product.state, StateEnum.Resolved); // assert state
      assert.deepEqual(balanceBefore.add(price), balanceAfter); // assert balance
    });

    it('should refund the customer', async function () {
      const { id, price } = testProduct;

      const balanceBefore = await web3.eth.getBalance(customer);
      await market.resolveDispute(id, customer);
      const balanceAfter = await web3.eth.getBalance(customer);
      const product = convertProduct(await market.products(id));

      assert.equal(product.state, StateEnum.Resolved); // assert state
      assert.deepEqual(balanceBefore.add(price), balanceAfter); // assert balance
    });

    it('should only allow refund to either the customer or the vendor', async function () {
      const { id } = testProduct;

      await expectThrow(
        market.resolveDispute(id, randomAddress)
      );
    })
  });
});
