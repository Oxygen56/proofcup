# ProofCup Architecture

## Product

ProofCup lets tournament organizers verify player eligibility and prepare stablecoin payouts without publishing player identity. It is packaged for three hackathons:

- Stellar ZK: the MatchPass Noir circuit proves knowledge of private roster data, emits a public nullifier, and is verified through a deployed Soroban UltraHonk verifier artifact set.
- CROO: a paid callable CAP agent audits receipts and prepares downstream payout handoffs.
- Tether Developers Cup: a football-themed WDK payout wallet turns bracket milestones into USDt payout intents.

## Data Flow

1. A player keeps `secret` and `roster_salt` private.
2. The Noir circuit computes public `commitment` and tournament-scoped `nullifier`.
3. The public receipt is bound into a Soroban receipt gate with proof, verification-key, public-input, payout-hash, receipt-hash, and nullifier commitments.
4. CROO agent audits the receipt and produces findings.
5. Tether WDK-style wallet prepares USDt payouts for verified winners.

## Current Implementation Status

- Working TypeScript proof workflow.
- Compilable Noir circuit source.
- Deployed Soroban UltraHonk verifier contract on Stellar testnet.
- Upgraded Soroban receipt gate with 8 exported functions, deterministic receipt hashing, artifact hash checks, and replay protection.
- CROO CAP manifest and OpenAPI shape.
- Tether WDK payout intent model.

## Production Next Steps

- Merge the receipt-aware gate and the full UltraHonk verifier into one production contract once verifier cost and host-function limits are tuned.
- Register the CROO agent on Agent Store.
- Select WDK target chain and bind payout signing.
