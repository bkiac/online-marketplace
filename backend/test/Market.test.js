const moment = require('moment');
const { StateEnum } = require('./util/StateEnum');
const { expectThrow } = require('./util/expectThrow');

const Market = artifacts.require('Market');

// Product struct for clarity:
// struct Product {
//   string name;
//   uint256 price;
//   uint256 id;
//   uint256 guaranteedShippingTime;
//   uint256 dateOfPurchase;
//   uint256 dateOfShipping;
//   State state;
//   address vendor;
//   address customer;
// }

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
      const product = await market.products(id);
   
      assert.equal(numOfProducts, 1);
      assert.equal(product[0], name); // assert name
      assert.equal(product[1].toNumber(), price); // assert price
      assert.equal(product[2].toNumber(), id); // assert id
      assert.equal(product[3].toNumber(), guaranteedShippingTime); // assert shipping time
      assert.equal(product[4].toNumber(), 0); // assert date of purchase is still zero
      assert.equal(product[5].toNumber(), 0); // assert date of shipping is still zero
      assert.equal(product[6].toNumber(), StateEnum.New); // assert state
      assert.equal(product[7], vendor); // assert vendor address
      assert.equal(product[8], ZERO_ADDRESS); // assert customer address is still address(0)
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
      const product = await market.products(id);
      const escrow = await market.escrows(id);

      assert.notEqual(product[4].toNumber(), 0); // assert date of purchase has been changed
      assert.equal(product[6].toNumber(), StateEnum.Purchased); // assert state
      assert.equal(product[8], customer); // assert customer address

      assert.equal(escrow[0].toNumber(), price); // assert held amount
      assert.equal(escrow[1].toNumber(), 0); // assert expiration date is still zero
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
      const product = await market.products(id);
      const escrow = await market.escrows(id);

      assert.notEqual(product[5].toNumber(), 0); // assert date of shipping has been changed
      assert.equal(product[6].toNumber(), StateEnum.Shipped); // assert state

      assert.notEqual(escrow[1].toNumber(), 0); // assert expiration date has been changed
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
      const product = await market.products(id);

      assert.equal(product[6].toNumber(), StateEnum.Received); // assert state
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
      const product = await market.products(id);

      assert.equal(product[6].toNumber(), StateEnum.Flagged); // assert state
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
      const product = await market.products(id);

      assert.equal(product[6].toNumber(), StateEnum.Resolved); // assert state
      assert.deepEqual(balanceBefore.add(price), balanceAfter); // assert balance
    });

    it('should refund the customer', async function () {
      const { id, price } = testProduct;

      const balanceBefore = await web3.eth.getBalance(customer);
      await market.resolveDispute(id, customer);
      const balanceAfter = await web3.eth.getBalance(customer);
      const product = await market.products(id);

      assert.equal(product[6].toNumber(), StateEnum.Resolved); // assert state
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
