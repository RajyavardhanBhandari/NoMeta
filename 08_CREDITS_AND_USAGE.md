# NoMeta — Credits System

## Rules
- Daily free allowance: 2 successful cleanings per calendar day.
- Paid allowance: 1 credit per successful paid image cleaning.
- Credit balance is server-side.
- Failed cleaning must not permanently consume a credit.

## Ledger model
Credits are represented as immutable ledger entries rather than a client-controlled counter:
- `purchase`: +N
- `consume`: -N
- `refund`: +N
- `adjustment`: controlled administrative correction

Balance is derived from the ledger or maintained transactionally from it.

## Atomicity
Credit consumption and the corresponding cleaning entitlement must be performed in a database transaction or equivalent atomic operation. A request must not be able to spend the same credit twice concurrently.
