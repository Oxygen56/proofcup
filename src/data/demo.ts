import type { PlayerClaim } from "../lib/proofcup";

export const demoClaim: PlayerClaim = {
  playerAlias: "Midfield Lynx",
  teamId: 7,
  tournamentId: 20260703,
  secret: 42n,
  rosterSalt: 1337n,
  payoutAddress: "GCPROOFCUPSTELLARTESTNETPUBLICPAYOUTADDRESS"
};

export const payoutManifest = [
  {
    round: "Group Stage",
    team: "Atlas FC",
    payoutUsd: 250,
    status: "proof verified"
  },
  {
    round: "Quarter Final",
    team: "Nile United",
    payoutUsd: 500,
    status: "pending captain signature"
  },
  {
    round: "Final",
    team: "Andes XI",
    payoutUsd: 1000,
    status: "ready for WDK payout"
  }
];

export const tournamentBracket = [
  { round: "group", team: "Atlas FC", teamId: 7, amountUsd: 250 },
  { round: "quarter-final", team: "Nile United", teamId: 8, amountUsd: 500 },
  { round: "semi-final", team: "Andes XI", teamId: 9, amountUsd: 750 },
  { round: "final", team: "Orion City", teamId: 10, amountUsd: 1000 }
] as const;
