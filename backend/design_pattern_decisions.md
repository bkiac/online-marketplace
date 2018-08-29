# Design pattern decisions

## Pausable

Pausable contract is used to implement Emergency Stop design pattern and to enable
admin features through the Ownable contract.
Emergency Stop can be initiated by the contract owner to pause deposits and withdrawals.

### Ownable

The contract inherits from the Ownable contract.
```renounceOwnership``` and ```transferOwnership``` are currently not available from the frontend 
app.

## Testable

The Testable contract is a wrapper for the main Market contract, so it has access to the inherited 
data and allows the owner to manipulate the dates, if the contract is in development mode.

