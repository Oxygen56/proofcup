import type { PublicReceipt } from "./proofcup";
import { digest } from "./proofcup";

export type TetherCupTrack = "WDK";

export type WdkPayoutIntent = {
  track: TetherCupTrack;
  theme: "football-global-tournament";
  asset: "USDt";
  walletMode: "self-custodial";
  chainHint: "wdk-configurable";
  recipientAddressHash: string;
  amountUsd: number;
  memo: string;
  proofNullifier: string;
  policyId: string;
};

export type TournamentMilestone = {
  id: string;
  round: "group" | "quarter-final" | "semi-final" | "final";
  team: string;
  teamId: number;
  amountUsd: number;
  receipt: PublicReceipt;
};

export type PayoutPolicy = {
  id: string;
  asset: "USDt";
  maxSinglePayoutUsd: number;
  requireMatchPassNullifier: boolean;
  requireCaptainCosign: boolean;
  duplicateNullifierAction: "reject";
  sanctionsScreeningMode: "address-hash-precheck";
};

export type PayoutBatch = {
  batchId: string;
  policy: PayoutPolicy;
  totalUsd: number;
  intents: WdkPayoutIntent[];
  riskSummary: {
    duplicateNullifiers: string[];
    overLimitIntents: string[];
    ready: boolean;
  };
};

export const defaultPayoutPolicy: PayoutPolicy = {
  id: "proofcup-wdk-usdt-v1",
  asset: "USDt",
  maxSinglePayoutUsd: 5000,
  requireMatchPassNullifier: true,
  requireCaptainCosign: true,
  duplicateNullifierAction: "reject",
  sanctionsScreeningMode: "address-hash-precheck"
};

export function createWdkPayoutIntent(receipt: PublicReceipt, amountUsd: number): WdkPayoutIntent {
  return {
    track: "WDK",
    theme: "football-global-tournament",
    asset: "USDt",
    walletMode: "self-custodial",
    chainHint: "wdk-configurable",
    recipientAddressHash: receipt.payoutAddressHash,
    amountUsd,
    memo: `ProofCup team ${receipt.teamId} tournament ${receipt.tournamentId}`,
    proofNullifier: receipt.nullifier,
    policyId: defaultPayoutPolicy.id
  };
}

export function createPayoutBatch(milestones: TournamentMilestone[], policy: PayoutPolicy = defaultPayoutPolicy): PayoutBatch {
  const intents = milestones.map((milestone) => createWdkPayoutIntent(milestone.receipt, milestone.amountUsd));
  const seen = new Set<string>();
  const duplicateNullifiers: string[] = [];
  for (const intent of intents) {
    if (seen.has(intent.proofNullifier)) {
      duplicateNullifiers.push(intent.proofNullifier);
    }
    seen.add(intent.proofNullifier);
  }
  const overLimitIntents = intents
    .filter((intent) => intent.amountUsd > policy.maxSinglePayoutUsd)
    .map((intent) => intent.proofNullifier);

  return {
    batchId: digest(["wdk-batch", ...intents.map((intent) => intent.proofNullifier)]).slice(0, 24),
    policy,
    totalUsd: intents.reduce((sum, intent) => sum + intent.amountUsd, 0),
    intents,
    riskSummary: {
      duplicateNullifiers,
      overLimitIntents,
      ready: duplicateNullifiers.length === 0 && overLimitIntents.length === 0
    }
  };
}

export function explainTetherFit(intent: WdkPayoutIntent): string[] {
  return [
    `Uses the ${intent.track} track by modeling a self-custodial payout wallet.`,
    "Maps football knockout rounds to stable USDt prize payouts.",
    "Keeps player identity private while letting organizers reject duplicate claims.",
    "Produces a policy-checked batch that can be wired to WDK wallet modules once deploy keys and target chains are selected."
  ];
}
