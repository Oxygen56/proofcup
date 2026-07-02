# ProofCup Architecture

## Product

ProofCup lets tournament organizers verify player eligibility and prepare stablecoin payouts without publishing player identity. It is packaged for three hackathons:

- Stellar ZK: the MatchPass Noir circuit proves knowledge of private roster data and emits a public nullifier.
- CROO: a paid callable CAP agent audits receipts and prepares downstream payout handoffs.
- Tether Developers Cup: a football-themed WDK payout wallet turns bracket milestones into USDt payout intents.

## Data Flow

1. A player keeps `secret` and `roster_salt` private.
2. The Noir circuit computes public `commitment` and tournament-scoped `nullifier`.
3. The public receipt can be stored or checked by the Soroban verifier.
4. CROO agent audits the receipt and produces findings.
5. Tether WDK-style wallet prepares USDt payouts for verified winners.

## Current Implementation Status

- Working TypeScript proof workflow.
- Compilable Noir circuit source.
- Deployed Soroban verifier contract on Stellar testnet.
- CROO CAP manifest and OpenAPI shape.
- Tether WDK payout intent model.

## Production Next Steps

- Convert proof verifier to Stellar BN254 host functions.
- Register the CROO agent on Agent Store.
- Select WDK target chain and bind payout signing.
