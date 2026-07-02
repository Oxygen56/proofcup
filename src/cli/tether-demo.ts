import { createMatchPassProof } from "../lib/proofcup";
import { createPayoutBatch, type TournamentMilestone } from "../lib/tether";
import { demoClaim, tournamentBracket } from "../data/demo";

const milestones: TournamentMilestone[] = tournamentBracket.map((row, index) => {
  const claim = {
    ...demoClaim,
    teamId: row.teamId,
    secret: demoClaim.secret + BigInt(index),
    rosterSalt: demoClaim.rosterSalt + BigInt(index)
  };
  return {
    id: `${row.round}-${row.teamId}`,
    round: row.round,
    team: row.team,
    teamId: row.teamId,
    amountUsd: row.amountUsd,
    receipt: createMatchPassProof(claim).receipt
  };
});

console.log(JSON.stringify(createPayoutBatch(milestones), null, 2));
