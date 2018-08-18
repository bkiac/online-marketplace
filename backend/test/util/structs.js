// Converts incoming struct arrays to objects

function convertProduct(product) {
  return {
    name: product[0],
    price: product[1].toNumber(),
    id: product[2].toNumber(),
    guaranteedShippingTime: product[3].toNumber(),
    dateOfPurchase: product[4].toNumber(),
    dateOfShipping: product[5].toNumber(),
    state: product[6].toNumber(),
    vendor: product[7],
    customer: product[8],
  }
}

function convertEscrow(escrow) {
  return {
    amountHeld: escrow[0].toNumber(),
    expirationDate: escrow[1].toNumber(),
  }
}

module.exports = {
  convertProduct,
  convertEscrow,
};
