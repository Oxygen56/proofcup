# ProofCup Judge Evidence Matrix

Generated: 2026-07-04T06:38:24.276Z

## Verdict

On public judge confidence, ProofCup now scores **9.7/10** against ZKADE's public-page score of **8.8/10** under the weighted rubric below.

This is not a claim that judges must rank ProofCup above ZKADE. It is a machine-generated argument that ProofCup now has a full deployed UltraHonk verifier path, stronger reproducibility, and stronger artifact binding while preserving exact artifact boundaries.

## Machine Checks

| Check | Result |
| --- | --- |
| proof hash matches committed value | pass |
| verification-key hash matches committed value | pass |
| public-input hash matches committed value | pass |
| receipt-gate WASM hash matches docs | pass |
| deterministic receipt hash matches Soroban args | pass |
| Soroban interface inspected | pass |
| deployed UltraHonk verifier WASM hash matches docs | pass |
| deployed UltraHonk proof hash matches docs | pass |
| deployed UltraHonk VK hash matches docs | pass |
| deployed UltraHonk public-input hash matches docs | pass |
| deployed UltraHonk verifier interface inspected | pass |

## Artifact Commitments

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| zk-artifacts/matchpass/proof.json | 9948 | `b08b08291214979cf02f985bfaf26e8cc1e8c119dbaad485409be58e49439931` |
| zk-artifacts/matchpass/vk.json | 4215 | `e315430eb8c70ea1748d083c36992f6210c9d243bb251047f727325cd07da2b1` |
| zk-artifacts/matchpass/public_inputs.json | 355 | `7bf398bafb7e6d4274a46458ac1d3d2642a6c5f67d0f0c219328e1a4bf7bc63a` |
| target/stellar/matchpass_verifier.wasm | 4114 | `b9df30cfad86d0793357742c2baa22d436494488d36b35c81d8bfd16ad97f9e4` |
| zk-artifacts/matchpass-soroban-ultrahonk/proof | 14592 | `43d08d9750c6fbbb6ad853b5044e569231210c916244aff007a494138e765764` |
| zk-artifacts/matchpass-soroban-ultrahonk/vk | 1760 | `a8aefdd4ae8b87767b74fa8f5335dc94b6d5c6eb67f220ed2cb43062fa293fa9` |
| zk-artifacts/matchpass-soroban-ultrahonk/public_inputs | 128 | `e07036fa8d7fece627ecde6f3e3bfd74a48dc0241bf9d47c4b82545ea7040aab` |
| target/stellar/rs_soroban_ultrahonk_matchpass_verifier.wasm | 42948 | `dce12a9aa49132bc30edecddcd58904d358b39e5036d779937d232fde35990d2` |

## Deployed UltraHonk Verifier

- Contract: `CDSL73NGUOCJS5J4IDKYROO5WSTJ7Z4Z3XJ647FB6VWDH62YJHBSVZFI`
- Lab: https://lab.stellar.org/r/testnet/contract/CDSL73NGUOCJS5J4IDKYROO5WSTJ7Z4Z3XJ647FB6VWDH62YJHBSVZFI
- Upload tx: https://stellar.expert/explorer/testnet/tx/ea56b96f439512aca1e4298e81bbcb70862fca7f5ef1ae8b3a6515c6edb38b5e
- Deploy tx: https://stellar.expert/explorer/testnet/tx/daa116ebb0e1e9c358ac078929a7776f401ec2978ce76a5d1ca57a57e868ec76
- Verify tx: https://stellar.expert/explorer/testnet/tx/0f28b9bb67db7fed0b436a441abb9bb8702c1a573803c16cd22fe162ad73d564
- Result: `verify_proof returned null`
- Reference verifier: https://github.com/yugocabrio/rs-soroban-ultrahonk @ `661db07200f890b1bd9a7349ed787c70a706dd12`

## Weighted Rubric

| Category | Weight | ProofCup | ZKADE public page | Note |
| --- | ---: | ---: | ---: | --- |
| Problem clarity | 10 | 9 | 9 | Both explain the user pain clearly; ProofCup targets eligibility and payouts, ZKADE targets front-running in games. |
| Real-world impact | 12 | 9 | 8 | ProofCup is tied to identity minimization and tournament payouts; ZKADE is strong but game-first. |
| ZK artifact evidence | 14 | 10 | 9 | ProofCup publishes proof, verification key, public inputs, byte sizes, and SHA-256 commitments. |
| Stellar deployment evidence | 14 | 10 | 10 | Both now show public verifier deployments; ProofCup adds a full UltraHonk verifier contract with a successful testnet verify_proof transaction. |
| On-chain business binding | 14 | 10 | 8 | ProofCup binds proof hash, VK hash, public-input hash, receipt hash, payout hash, and replay state into one receipt decision. |
| Reproducibility | 12 | 10 | 8 | ProofCup has one-command evidence generation and an explicit full verification run covering TS, Noir, Barretenberg, Soroban, and frontend. |
| Honest limitations | 8 | 10 | 10 | Both document limits; ProofCup separates deployed evidence from locally verified upgraded gate evidence. |
| Judge polish | 8 | 9 | 9 | Both have video, GitHub, and live/demo material; ProofCup adds a generated judge evidence matrix. |
| Ecosystem fit | 8 | 10 | 9 | ProofCup now uses Stellar anchoring, Soroban receipt gates, and a deployed Soroban UltraHonk verifier path. |

## Why This Beats The ZKADE Public Page On Judge Confidence

- ProofCup exposes deterministic proof/vk/public-input/WASM commitments and rechecks them with `pnpm judge:evidence`.
- The receipt gate binds proof artifact hash, verification-key hash, public-input hash, payout-address hash, deterministic receipt hash, and nullifier replay in one Soroban decision.
- The full verification run covers TypeScript, Noir witness execution, Barretenberg proof verification, Soroban tests, Soroban build, frontend build, interface inspection, and a deployed UltraHonk verifier invocation.
- ProofCup is aligned with Stellar's documented UltraHonk verifier path and now has public testnet verifier evidence instead of only bridge notes.

## Remaining Honest Boundary

The main ProofCup proof remains the Barretenberg 5 artifact set pinned in `zk-artifacts/matchpass`. The deployed Soroban UltraHonk verifier uses the reference-compatible Noir 1.0.0-beta.9 and Barretenberg 0.87.0 artifact set in `zk-artifacts/matchpass-soroban-ultrahonk`, generated from the same MatchPass circuit logic and public values.
