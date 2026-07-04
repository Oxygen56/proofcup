# DoraHacks Field Values

## Common Links

- GitHub: `https://github.com/Oxygen56/proofcup`
- Live demo: `https://oxygen56.github.io/proofcup/`
- Release package: `https://github.com/Oxygen56/proofcup/releases/tag/v0.1.7`
- Demo video: `https://github.com/Oxygen56/proofcup/releases/download/v0.1.5/proofcup-demo.mov`
- Stellar tx: `https://stellar.expert/explorer/testnet/tx/2fd0119b5ae81f695d81f38a29efa440e9f05009b08463071f8c942608159681`
- UltraHonk verifier contract: `CDSL73NGUOCJS5J4IDKYROO5WSTJ7Z4Z3XJ647FB6VWDH62YJHBSVZFI`
- UltraHonk verify tx: `https://stellar.expert/explorer/testnet/tx/0f28b9bb67db7fed0b436a441abb9bb8702c1a573803c16cd22fe162ad73d564`
- UltraHonk verifier WASM hash: `dce12a9aa49132bc30edecddcd58904d358b39e5036d779937d232fde35990d2`
- Soroban contract: `CBNGZ5V25IPGHVBTNSM7GQSZVHDMAZCFZDTL6S2DZTDEZSYHCTKKU3MK`
- Soroban verify tx: `https://stellar.expert/explorer/testnet/tx/cd5cee33bdedfbb1c6283718d1e384a8f8244046025d35068feed708157c4fa6`
- Receipt-gate WASM hash: `b9df30cfad86d0793357742c2baa22d436494488d36b35c81d8bfd16ad97f9e4`
- Receipt-gate hash: `9f9255f69868fb538dd6c12a663439b807c76990e1166fbd8dc136b5c92acbaa`
- Screenshot: `docs/screenshots/proofcup-demo-fullpage.png`

## DoraHacks Submit Pages

- Stellar Hacks: `https://dorahacks.io/hackathon/stellar-hacks-zk/buidl`
- CROO Agent Hackathon: `https://dorahacks.io/hackathon/croo-hackathon/buidl`
- Tether Developers Cup: `https://dorahacks.io/hackathon/tether-developers-cup/buidl`

## Stellar Hacks: Real-World ZK

- Project name: `ProofCup MatchPass`
- Tagline: `Private football eligibility proofs with Stellar-ready nullifiers for duplicate-claim prevention.`
- Description: `ProofCup MatchPass lets tournament players prove private roster eligibility without exposing identity, anchors the receipt hash on Stellar testnet, and verifies MatchPass proof artifacts through a deployed Soroban UltraHonk verifier contract. It includes the Noir circuit, Barretenberg UltraHonk proof artifacts, verification key, public inputs, proof/vk/public-input hashes, deployed verifier contract id, verify_proof transaction, receipt/nullifier gate, generated judge evidence matrix, and reproducible demo.`

## CROO Agent Hackathon

- Project name: `ProofCup MatchPass Auditor`
- Tagline: `A paid callable agent that audits private roster proof receipts and payout readiness.`
- Description: `ProofCup MatchPass Auditor exposes a CROO-style HTTP agent with /health, /sample, /audit, and /payout-intent endpoints. The agent verifies MatchPass receipts, scores payout readiness, detects privacy and duplicate-nullifier risk, and hands off verified receipts to a payout intent flow.`

## Tether Developers Cup

- Project name: `ProofCup Wallet`
- Track: `WDK`
- Tagline: `A football global tournament wallet that prepares self-custodial USDt payouts from private eligibility receipts.`
- Description: `ProofCup Wallet is a football tournament payout workflow for the WDK track. It maps bracket milestones to USDt payout intents, checks a self-custodial payout policy, rejects duplicate proof nullifiers, and keeps player identity private with MatchPass receipts.`
