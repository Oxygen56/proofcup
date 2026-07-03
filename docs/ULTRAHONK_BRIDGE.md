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

## Reference Verifier Path

The public reference path is Nethermind's Soroban UltraHonk verifier:

- https://github.com/NethermindEth/rs-soroban-ultrahonk

That verifier stores the verification key at deployment and verifies `proof` + `public_inputs` in a Soroban contract. Its published README targets an earlier Noir/Barretenberg pair than ProofCup's generated artifacts, so ProofCup does not claim the current proof has already been accepted by that verifier.

## Why This Still Improves The Submission

ZKADE's advantage is a visible on-chain verifier story. ProofCup now answers with the exact Stellar-native verifier route for its actual proof system, plus immutable artifact commitments and a receipt-aware Soroban gate. The production step is narrowed to one concrete task: regenerate or adapt ProofCup's MatchPass artifacts against the compatible UltraHonk verifier toolchain, then deploy the verifier contract with the stored VK.
