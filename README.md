# Online Marketplace

Online Marketplace is my final project for ConsenSys Academy's 2018 
Developer Program.

## Description

> NOTE: This is a learning project to try out various tools, frameworks and design patterns
> in the Ethereum ecosystem and shouldn't be viewed as a genuine implementation of a decentralized
> marketplace.

This is an online marketplace written that operates on the [Ethereum][ethereum] blockchain. 
The smart contracts were implemented in [Solidity][solidity], 
the frontend application uses [React][react] with [Drizzle][drizzle] to interact with the data on 
the blockchain.

The application allows any user to create new product listings or purchase an already create 
listing from an other user.
At the time of a purchase, the sent ether will be locked in an escrow.
After the vendor noticed that a purchase has been made, he has 3 days to signal to the user that 
the shipment is on its way. 
If he fails to ship the product in 3 days, the customer can withdraw their spent ether from the 
escrow. 
The vendor can only withdraw the funds from the escrow if the customer didn't raise a dispute 
about the shipment in time, or if they had signaled to the vendor that the package has arrived in 
time.
The disputes are resolved by the contract owner by refunding either the vendor or the customer.

### User stories

- Any user can
  - create new product listings
  - purchase an other user's listed product.

- Vendor -- a user with a purchased product -- can
  - signal to the customer that the product was shipped
  - withdraw from an escrow if the product has been received
  - withdraw from an escrow if the customer hasn't raised a dispute after 
  the guaranteed shipping time has passed but the conflict period hasn't 
  expired yet
    - withdraw available at ```purchaseDate + guaranteedShippingTime + 3  days```

- Customer -- a user who purchased a product -- can
  - withdraw from an escrow if the product wasn't shipped 3 days after purchase
  - flag a shipped product to raise a dispute about the shipment
    - flagging a product is available for 3 days after the guaranteed shipping date

- Contract owner can
  - resolve disputes in favor of either the vendor or the customer

## Getting started

The project uses [Truffle][truffle], [Ganache CLI][ganache-cli] and 
[MetaMask][metamask] so make sure you have all of them installed.

After you downloaded the repository, install the required dependencies for 
the smart contracts and deploy them on your local ```ganache-cli``` 
blockchain.

```sh
cd backend
npm install
ganache-cli
truffle migrate
```

After you've successfully deployed the contracts, start the frontend app by 
installing the required dependencies and launching the React app.

```sh
cd frontend
npm install
npm start
```

The app should be available on http://localhost:3000 in your browser.

Import your accounts into MetaMask by copying the wallet mnemonic from 
```ganache-cli``` and setting a new password.

Now you should be logged in as the contract owner.
You are ready to interact with the application!
> NOTE: For easier testing, you should turn on development mode on the
> Admin/Contract settings page.

## Tests

You can test the smart contracts with a running ```ganache-cli``` blockchain using Truffle tests.

```sh
cd backend
truffle test
```

There are no tests for the React app.

## Room for improvement

- Solidity
  - improve gas costs
  - implement Upgradeable Contract design pattern
  - obfuscate product purchases to prevent front running
  - accept ERC-20 tokens as payment
  - ...

- React app
  - tests
  - refactor redundant and complex components
  - update UI on every meaningful transaction on the blockchain
    - currently some UI features (e.g.: current account display) update properly, but
    product updates are stuck sometimes
  - use events for UI updates
  - display error messages instead of console errors after failed transactions
  - improve MetaMask responsivity?
    - I'm not sure, if it's because of my wrong implementation but MetaMask sometimes gets stuck 
    for even 1-2 minutes before recognizing it should start a transaction, at other times it works
    perfectly well
  - ...


[truffle]: https://github.com/trufflesuite/truffle
[ganache-cli]: https://github.com/trufflesuite/ganache-cli
[metamask]: https://metamask.io/
[ethereum]: https://www.ethereum.org/
[solidity]: https://solidity.readthedocs.io/en/v0.4.24/
[react]: https://reactjs.org/
[drizzle]: https://truffleframework.com/drizzle