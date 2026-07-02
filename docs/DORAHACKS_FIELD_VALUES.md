# DoraHacks Field Values

## Common Links

- GitHub: `https://github.com/Oxygen56/proofcup`
- Live demo: `https://oxygen56.github.io/proofcup/`
- Release package: `https://github.com/Oxygen56/proofcup/releases/tag/v0.1.5`
- Demo video: `https://github.com/Oxygen56/proofcup/releases/download/v0.1.5/proofcup-demo.mov`
- Stellar tx: `https://stellar.expert/explorer/testnet/tx/2fd0119b5ae81f695d81f38a29efa440e9f05009b08463071f8c942608159681`
- Soroban contract: `CBNGZ5V25IPGHVBTNSM7GQSZVHDMAZCFZDTL6S2DZTDEZSYHCTKKU3MK`
- Soroban verify tx: `https://stellar.expert/explorer/testnet/tx/cd5cee33bdedfbb1c6283718d1e384a8f8244046025d35068feed708157c4fa6`
- Screenshot: `docs/screenshots/proofcup-demo-fullpage.png`

## DoraHacks Submit Pages

- Stellar Hacks: `https://dorahacks.io/hackathon/stellar-hacks-zk/buidl`
- CROO Agent Hackathon: `https://dorahacks.io/hackathon/croo-hackathon/buidl`
- Tether Developers Cup: `https://dorahacks.io/hackathon/tether-developers-cup/buidl`

## Stellar Hacks: Real-World ZK

- Project name: `ProofCup MatchPass`
- Tagline: `Private football eligibility proofs with Stellar-ready nullifiers for duplicate-claim prevention.`
- Description: `ProofCup MatchPass lets tournament players prove private roster eligibility without exposing identity, anchors the receipt hash on Stellar testnet, and verifies the public receipt through a deployed Soroban nullifier contract. It includes a Noir circuit, Barretenberg UltraHonk proof artifacts, verification key, public inputs, WASM hash, contract id, and reproducible demo.`

## CROO Agent Hackathon

- Project name: `ProofCup MatchPass Auditor`
- Tagline: `A paid callable agent that audits private roster proof receipts and payout readiness.`
- Description: `ProofCup MatchPass Auditor exposes a CROO-style HTTP agent with /health, /sample, /audit, and /payout-intent endpoints. The agent verifies MatchPass receipts, scores payout readiness, detects privacy and duplicate-nullifier risk, and hands off verified receipts to a payout intent flow.`

## Tether Developers Cup

- Project name: `ProofCup Wallet`
- Track: `WDK`
- Tagline: `A football global tournament wallet that prepares self-custodial USDt payouts from private eligibility receipts.`
- Description: `ProofCup Wallet is a football tournament payout workflow for the WDK track. It maps bracket milestones to USDt payout intents, checks a self-custodial payout policy, rejects duplicate proof nullifiers, and keeps player identity private with MatchPass receipts.`
