# Judge Notes

## Why This Is More Than A Wrapper

- A Noir circuit defines the privacy boundary.
- Barretenberg produces a real proof artifact and verification key.
- A Stellar testnet transaction anchors the receipt hash.
- A deployed Soroban UltraHonk verifier stores the VK and accepts the MatchPass proof/public-input artifact set on testnet.
- A deployed Soroban contract stores nullifiers and rejects duplicate claims.
- The upgraded Soroban receipt gate binds `proof.json`, `vk.json`, public inputs, receipt hash, payout hash, and nullifier replay into contract tests and a 4,114-byte WASM build.
- The CROO component is an HTTP-callable audit agent, not only a prompt.
- The Tether component models real payout operations: policy, duplicate checks, batch totals, and USDt intent records.

## Highest-Prize Angle

- Stellar ZK: real-world privacy use case, proof artifacts, Stellar anchoring, deployed Soroban UltraHonk verifier evidence, and a receipt-aware proof gate.
- CROO: paid callable CAP-style agent with OpenAPI and smoke test.
- Tether Developers Cup: football tournament wallet with WDK dependency and stablecoin payout workflow.

## Honest Limits

- The main Barretenberg 5 proof set and the deployed Soroban-compatible proof set are separate pinned artifacts generated from the same MatchPass circuit logic and public values.
- CROO Agent Store external listing requires account login.
- Stellar Hacks: Real-World ZK has been submitted on DoraHacks and is under review.
- CROO and Tether DoraHacks submissions still require their separate final form flows.
- The release video and GitHub Pages demo URL are public.
