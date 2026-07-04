# UltraHonk Bridge Evidence

ProofCup uses Noir + Barretenberg UltraHonk, matching the Stellar ecosystem direction documented in:

- https://developers.stellar.org/docs/build/apps/privacy
- https://developers.stellar.org/docs/build/apps/zk

## Current ProofCup Backend

- Noir: 1.0.0-beta.22
- Barretenberg: 5.0.0-nightly.20260522
- Scheme: ultra_honk
- Proof bytes: 9948
- VK bytes: 4215
- Public-input bytes: 355

## Deployed Reference Verifier Path

The public reference verifier path is:

- https://github.com/yugocabrio/rs-soroban-ultrahonk
- commit: `661db07200f890b1bd9a7349ed787c70a706dd12`

That verifier stores the verification key at deployment and verifies `proof` + `public_inputs` in a Soroban contract. ProofCup generated a MatchPass-compatible artifact set on the verifier-compatible toolchain and deployed it on Stellar testnet.

## Deployed Verifier Evidence

- Contract: `CDSL73NGUOCJS5J4IDKYROO5WSTJ7Z4Z3XJ647FB6VWDH62YJHBSVZFI`
- Lab: https://lab.stellar.org/r/testnet/contract/CDSL73NGUOCJS5J4IDKYROO5WSTJ7Z4Z3XJ647FB6VWDH62YJHBSVZFI
- Verify tx: https://stellar.expert/explorer/testnet/tx/0f28b9bb67db7fed0b436a441abb9bb8702c1a573803c16cd22fe162ad73d564
- Verifier WASM SHA-256: `dce12a9aa49132bc30edecddcd58904d358b39e5036d779937d232fde35990d2`
- Proof SHA-256: `43d08d9750c6fbbb6ad853b5044e569231210c916244aff007a494138e765764`
- VK SHA-256: `a8aefdd4ae8b87767b74fa8f5335dc94b6d5c6eb67f220ed2cb43062fa293fa9`
- Public inputs SHA-256: `e07036fa8d7fece627ecde6f3e3bfd74a48dc0241bf9d47c4b82545ea7040aab`
- Local verifier run: `experiments/runs/20260704-141850_proofcup-ultrahonk-matchpass-local-verify`

## Artifact Boundary

The main submission keeps the Barretenberg 5 artifacts in `zk-artifacts/matchpass`. The deployed verifier uses the reference-compatible artifact set in `zk-artifacts/matchpass-soroban-ultrahonk`. Both are pinned by SHA-256 so judges can distinguish the production proof artifact from the deployed verifier proof without trusting prose.
