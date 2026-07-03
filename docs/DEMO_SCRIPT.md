# 2-3 Minute Demo Script

## 0:00-0:20 Problem

"ProofCup solves privacy-preserving football tournament payouts. Organizers need to stop duplicate roster claims and payout fraud, but players should not have to publish identity documents or wallet addresses."

## 0:20-0:55 ZK Proof

Show the MatchPass receipt in the web app.

"The player keeps `secret` and `roster_salt` private. The Noir circuit proves knowledge of those values and emits only public `team_id`, `tournament_id`, `commitment`, and `nullifier`. Barretenberg generates and verifies an UltraHonk proof."

Commands to show:

```bash
pnpm nargo:compile
pnpm nargo:execute
pnpm proof:prove
pnpm proof:verify
```

## 0:55-1:20 Stellar Evidence

Open:

`https://stellar.expert/explorer/testnet/tx/2fd0119b5ae81f695d81f38a29efa440e9f05009b08463071f8c942608159681`

Then open:

`https://lab.stellar.org/r/testnet/contract/CBNGZ5V25IPGHVBTNSM7GQSZVHDMAZCFZDTL6S2DZTDEZSYHCTKKU3MK`

`https://stellar.expert/explorer/testnet/tx/cd5cee33bdedfbb1c6283718d1e384a8f8244046025d35068feed708157c4fa6`

"The receipt hash is anchored on Stellar testnet, and the deployed Soroban contract stores the public nullifier. The upgraded receipt gate adds proof hash, verification-key hash, public-input hash, payout hash, and receipt hash checks before writing the nullifier. The first deployed `verify_matchpass` invocation returned true; a duplicate nullifier simulation returns false before any payout is released."

Show the upgraded local proof gate:

```bash
pnpm soroban:test
pnpm soroban:build
stellar contract info interface --wasm target/stellar/matchpass_verifier.wasm
```

## 1:20-1:50 CROO Agent

Run:

```bash
pnpm agent:smoke
```

"The CROO agent exposes `/audit` and `/payout-intent`. It is a paid callable service that validates proof receipts, scores payout readiness, and hands off to the payout agent."

## 1:50-2:20 Tether WDK Flow

Run:

```bash
pnpm tether:demo
```

"The Tether Cup track is WDK. The wallet flow creates policy-checked USDt payout batches for football bracket milestones, rejects duplicate nullifiers, and keeps player identity private."

## 2:20-2:45 Close

"ProofCup is one coherent product packaged three ways: Stellar ZK proof receipts, CROO paid audit agent, and Tether WDK payout wallet. The demo is local, reproducible, and includes proof artifacts, an Agent API, and a Stellar testnet transaction."
