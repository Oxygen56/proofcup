# Soroban Receipt-Aware Proof Gate

The original Stellar testnet deployment proves that ProofCup can anchor a MatchPass receipt and reject duplicate nullifiers on Soroban. The upgraded proof gate strengthens the judge-facing ZK story by binding the off-chain proof artifacts to the on-chain decision.

## Contract Functions

- `verify_matchpass_receipt`: checks receipt fields, proof hash, verification-key hash, public-input hash, receipt hash, and nullifier replay.
- `receipt_hash`: computes the deterministic receipt digest used by TypeScript and Soroban.
- `receipt_verified`: confirms that a nullifier was accepted with a specific receipt hash.
- `expected_proof_hash`, `expected_vk_hash`, `expected_public_inputs_hash`: exposes the artifact commitments compiled into the contract.
- `verify_matchpass` and `seen_nullifier`: preserved for compatibility with the deployed receipt/nullifier contract flow.

## Bound Artifacts

- `proof.json`: `b08b08291214979cf02f985bfaf26e8cc1e8c119dbaad485409be58e49439931`
- `vk.json`: `e315430eb8c70ea1748d083c36992f6210c9d243bb251047f727325cd07da2b1`
- `public_inputs.json`: `7bf398bafb7e6d4274a46458ac1d3d2642a6c5f67d0f0c219328e1a4bf7bc63a`
- Receipt gate hash: `9f9255f69868fb538dd6c12a663439b807c76990e1166fbd8dc136b5c92acbaa`
- Upgraded WASM hash: `b9df30cfad86d0793357742c2baa22d436494488d36b35c81d8bfd16ad97f9e4`

## Verification Evidence

The contract test suite covers:

- accepted receipt gate stores the receipt hash and nullifier;
- duplicate nullifier is rejected;
- tampered proof hash is rejected before nullifier write;
- tampered receipt hash is rejected before nullifier write;
- zero fields are rejected.

Run:

```bash
pnpm soroban:test
pnpm soroban:build
stellar contract info interface --wasm target/stellar/matchpass_verifier.wasm
```

## Deployment Note

The receipt/nullifier testnet contract remains public at:

`CBNGZ5V25IPGHVBTNSM7GQSZVHDMAZCFZDTL6S2DZTDEZSYHCTKKU3MK`

The full UltraHonk verifier contract is deployed separately at:

`CDSL73NGUOCJS5J4IDKYROO5WSTJ7Z4Z3XJ647FB6VWDH62YJHBSVZFI`

It stores the MatchPass verification key and accepted the pinned Soroban-compatible proof/public-input artifact set in testnet transaction:

`0f28b9bb67db7fed0b436a441abb9bb8702c1a573803c16cd22fe162ad73d564`

The receipt gate and UltraHonk verifier are currently separate contracts. The production merge path is to combine receipt binding, nullifier replay protection, and `verify_proof` into one tuned contract once Stellar host-function costs are profiled.
