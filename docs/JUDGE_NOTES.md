# Judge Notes

## Why This Is More Than A Wrapper

- A Noir circuit defines the privacy boundary.
- Barretenberg produces a real proof artifact and verification key.
- A Stellar testnet transaction anchors the receipt hash.
- A deployed Soroban contract stores nullifiers and rejects duplicate claims.
- The CROO component is an HTTP-callable audit agent, not only a prompt.
- The Tether component models real payout operations: policy, duplicate checks, batch totals, and USDt intent records.

## Highest-Prize Angle

- Stellar ZK: real-world privacy use case, proof artifacts, Stellar anchoring, and a deployed Soroban verifier.
- CROO: paid callable CAP-style agent with OpenAPI and smoke test.
- Tether Developers Cup: football tournament wallet with WDK dependency and stablecoin payout workflow.

## Honest Limits

- The Soroban contract currently verifies receipt shape and nullifier uniqueness; full BN254 proof verification can be wired to Stellar host functions as the protocol surface stabilizes.
- CROO Agent Store external listing requires account login.
- DoraHacks final submission requires account login and CAPTCHA handling.
- The release video and GitHub Pages demo URL are already available for submission.
