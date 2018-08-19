# Avoiding common attacks

## Race conditions
- There are no external calls, and all internal work is done before calling another function.
- Escrow withdraw methods can't be called more than once.

## Timestamp Dependence
- The product states are heavily dependent on time but they should tolerate a 30-second drift.

## Integer Overflow and Underflow
- All arithmetic operations are replaced by the SafeMath library.

## Forcibly sending ether to a contract
- ```this.balance``` is not used in any contract.

## Front Running
- No solution yet
