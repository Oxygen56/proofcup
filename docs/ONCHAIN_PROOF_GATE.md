# Soroban Receipt-Aware Proof Gate

The original Stellar testnet deployment proves that ProofCup can anchor a MatchPass receipt and reject duplicate nullifiers on Soroban. The upgraded proof gate strengthens the judge-facing ZK story by binding the off-chain proof artifacts to the on-chain decision.

## Contract Functions

- `verify_matchpass_receipt`: checks receipt fields, proof hash, verification-key hash, public-input hash, receipt hash, and nullifier replay.
- `receipt_hash`: computes the deterministic receipt digest used by TypeScript and Soroban.
- `receipt_verified`: confirms that a nullifier was accepted with a specific receipt hash.
- `expected_proof_hash`, `expected_vk_hash`, `expected_public_inputs_hash`: exposes the artifact commitments compiled into the contract.
- `verify_matchpass` and `seen_nullifier`: preserved for compatibility with the first deployed testnet contract flow.

## Bound Artifacts

- `proof.json`: `8f50d86741be997da0777e99ccb94b7a4a1d75c548bc23bfc563b371f869c976`
- `vk.json`: `e315430eb8c70ea1748d083c36992f6210c9d243bb251047f727325cd07da2b1`
- `public_inputs.json`: `7bf398bafb7e6d4274a46458ac1d3d2642a6c5f67d0f0c219328e1a4bf7bc63a`
- Receipt gate hash: `9f9255f69868fb538dd6c12a663439b807c76990e1166fbd8dc136b5c92acbaa`
- Upgraded WASM hash: `6287720697927697eddbe9e3d310c1dccfb291f48d052c231c0c5d63f15bf097`

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

The first deployed testnet contract remains public at:

`CBNGZ5V25IPGHVBTNSM7GQSZVHDMAZCFZDTL6S2DZTDEZSYHCTKKU3MK`

The upgraded receipt-gate build is ready for redeploy. Attempts on 2026-07-04 reached multiple public RPC endpoints but were rejected by provider-side errors (`503`, `Connect`, and `403`), so the repository reports this as a verified local upgrade rather than claiming a second public deployment.
