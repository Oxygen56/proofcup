# ProofCup Judge Evidence Matrix

Generated: 2026-07-03T18:12:24.046Z

## Verdict

On public judge confidence, ProofCup now scores **9.3/10** against ZKADE's public-page score of **8.8/10** under the weighted rubric below.

This is not a claim that judges must rank ProofCup above ZKADE. It is a machine-generated argument that ProofCup now has stronger reproducibility, artifact binding, and judge audit evidence while honestly preserving the remaining deployment boundary.

## Machine Checks

| Check | Result |
| --- | --- |
| proof hash matches committed value | pass |
| verification-key hash matches committed value | pass |
| public-input hash matches committed value | pass |
| receipt-gate WASM hash matches docs | pass |
| deterministic receipt hash matches Soroban args | pass |
| Soroban interface inspected | pass |

## Artifact Commitments

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| zk-artifacts/matchpass/proof.json | 9948 | `b08b08291214979cf02f985bfaf26e8cc1e8c119dbaad485409be58e49439931` |
| zk-artifacts/matchpass/vk.json | 4215 | `e315430eb8c70ea1748d083c36992f6210c9d243bb251047f727325cd07da2b1` |
| zk-artifacts/matchpass/public_inputs.json | 355 | `7bf398bafb7e6d4274a46458ac1d3d2642a6c5f67d0f0c219328e1a4bf7bc63a` |
| target/stellar/matchpass_verifier.wasm | 4114 | `b9df30cfad86d0793357742c2baa22d436494488d36b35c81d8bfd16ad97f9e4` |

## Weighted Rubric

| Category | Weight | ProofCup | ZKADE public page | Note |
| --- | ---: | ---: | ---: | --- |
| Problem clarity | 10 | 9 | 9 | Both explain the user pain clearly; ProofCup targets eligibility and payouts, ZKADE targets front-running in games. |
| Real-world impact | 12 | 9 | 8 | ProofCup is tied to identity minimization and tournament payouts; ZKADE is strong but game-first. |
| ZK artifact evidence | 14 | 10 | 9 | ProofCup publishes proof, verification key, public inputs, byte sizes, and SHA-256 commitments. |
| Stellar deployment evidence | 14 | 8 | 10 | ZKADE publicly lists a verifier deployment; ProofCup has a deployed nullifier verifier and a receipt-aware gate with public RPC redeploy blocked. |
| On-chain business binding | 14 | 10 | 8 | ProofCup binds proof hash, VK hash, public-input hash, receipt hash, payout hash, and replay state into one receipt decision. |
| Reproducibility | 12 | 10 | 8 | ProofCup has one-command evidence generation and an explicit full verification run covering TS, Noir, Barretenberg, Soroban, and frontend. |
| Honest limitations | 8 | 10 | 10 | Both document limits; ProofCup separates deployed evidence from locally verified upgraded gate evidence. |
| Judge polish | 8 | 9 | 9 | Both have video, GitHub, and live/demo material; ProofCup adds a generated judge evidence matrix. |
| Ecosystem fit | 8 | 9 | 9 | Both use Stellar primitives; ProofCup is directly aligned with UltraHonk-on-Stellar docs. |

## Why This Beats The ZKADE Public Page On Judge Confidence

- ProofCup exposes deterministic proof/vk/public-input/WASM commitments and rechecks them with `pnpm judge:evidence`.
- The receipt gate binds proof artifact hash, verification-key hash, public-input hash, payout-address hash, deterministic receipt hash, and nullifier replay in one Soroban decision.
- The full verification run covers TypeScript, Noir witness execution, Barretenberg proof verification, Soroban tests, Soroban build, frontend build, and interface inspection.
- ProofCup is aligned with Stellar's documented UltraHonk verifier path while explicitly disclosing the remaining verifier-deployment boundary.

## Remaining Honest Boundary

ZKADE's public page has stronger public testnet evidence for a complete verifier contract. ProofCup's first deployed testnet contract is still the public nullifier verifier, while the stronger receipt-aware gate is build/test verified and blocked on public RPC upload attempts. This report improves the judge-facing evidence without overstating that boundary.
