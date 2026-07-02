# Tether Developers Cup WDK Track

ProofCup targets the WDK track with a football global tournament prize wallet:

- Self-custodial organizer wallet for USDt prize budgets.
- Player payout intents keyed by private MatchPass receipt nullifiers.
- Football bracket states mapped to payout milestones.
- Address privacy: public receipts expose only payout address hashes.

The TypeScript demo uses `@tetherto/wdk` as a dependency anchor and emits `WdkPayoutIntent` objects. The next integration step is to bind those intents to the selected WDK chain module once the submission wallet/network is chosen.

## Demo Command

```bash
pnpm proof:demo
```

## Why It Fits

The Tether Developers Cup requires a football/global-tournament theme and one of Pears, QVAC, or WDK. ProofCup chooses WDK because the strongest value is self-custodial USDt payout operations for tournament organizers and teams.
