# DoraHacks Field Values

## Common Links

- GitHub: `https://github.com/Oxygen56/proofcup`
- Release package: `https://github.com/Oxygen56/proofcup/releases/tag/v0.1.3`
- Demo video: `https://github.com/Oxygen56/proofcup/releases/download/v0.1.3/proofcup-demo.mov`
- Stellar tx: `https://stellar.expert/explorer/testnet/tx/2fd0119b5ae81f695d81f38a29efa440e9f05009b08463071f8c942608159681`
- Screenshot: `docs/screenshots/proofcup-demo-fullpage.png`

## Stellar Hacks: Real-World ZK

- Project name: `ProofCup MatchPass`
- Tagline: `Private football eligibility proofs with Stellar-ready nullifiers for duplicate-claim prevention.`
- Description: `ProofCup MatchPass lets tournament players prove private roster eligibility without exposing identity, then anchors the receipt hash on Stellar testnet. It includes a Noir circuit, Barretenberg UltraHonk proof artifacts, verification key, public inputs, a Soroban verifier interface, and a reproducible local demo.`

## CROO Agent Hackathon

- Project name: `ProofCup MatchPass Auditor`
- Tagline: `A paid callable agent that audits private roster proof receipts and payout readiness.`
- Description: `ProofCup MatchPass Auditor exposes a CROO-style HTTP agent with /health, /sample, /audit, and /payout-intent endpoints. The agent verifies MatchPass receipts, scores payout readiness, detects privacy and duplicate-nullifier risk, and hands off verified receipts to a payout intent flow.`

## Tether Developers Cup

- Project name: `ProofCup Wallet`
- Track: `WDK`
- Tagline: `A football global tournament wallet that prepares self-custodial USDt payouts from private eligibility receipts.`
- Description: `ProofCup Wallet is a football tournament payout workflow for the WDK track. It maps bracket milestones to USDt payout intents, checks a self-custodial payout policy, rejects duplicate proof nullifiers, and keeps player identity private with MatchPass receipts.`
