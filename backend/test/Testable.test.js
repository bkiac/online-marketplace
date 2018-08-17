const moment = require('moment');

const Testable = artifacts.require('Testable');

contract('Testable', function (accounts) {
  let testable;

  beforeEach(async function () {
    testable = await Testable.new();
  });

  it('should be in development mode', async function () {
    await testable.setDevelopmentMode();

    const isDevelopmentMode = await testable.isDevelopmentMode();
    const conflictPeriod = await testable.conflictPeriod();

    assert.equal(isDevelopmentMode, true);
    assert.equal(conflictPeriod, moment.duration(3, 'minutes').asSeconds());
  });

  it('should be in production mode', async function () {
    await testable.setProductionMode();
    
    const isDevelopmentMode = await testable.isDevelopmentMode();
    const conflictPeriod = await testable.conflictPeriod();

    assert.equal(isDevelopmentMode, false);
    assert.equal(conflictPeriod, moment.duration(3, 'days').asSeconds());
  });
});
