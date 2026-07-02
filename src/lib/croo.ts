import type { MatchPassProof } from "./proofcup";
import { verifyMatchPassProof } from "./proofcup";

export type CrooCapRequest = {
  capVersion: "0.1";
  service: "proofcup.matchpass.audit";
  price: {
    amount: "0.50";
    currency: "USDC";
  };
  input: MatchPassProof;
};

export type CrooCapResponse = {
  accepted: boolean;
  chargeable: boolean;
  score: number;
  findings: string[];
  nextAgentCall?: {
    service: "proofcup.payout.prepare";
    reason: string;
  };
};

export function createCrooAuditRequest(proof: MatchPassProof): CrooCapRequest {
  return {
    capVersion: "0.1",
    service: "proofcup.matchpass.audit",
    price: {
      amount: "0.50",
      currency: "USDC"
    },
    input: proof
  };
}

export function runCrooAudit(request: CrooCapRequest): CrooCapResponse {
  const valid = verifyMatchPassProof(request.input);
  const findings = valid
    ? [
        "MatchPass proof arithmetic is valid.",
        "Public nullifier is tournament-scoped and suitable for duplicate-player checks.",
        "Payout address is represented only as a hash in the public receipt."
      ]
    : ["Proof failed local verification. Do not list this receipt for payout."];

  return {
    accepted: valid,
    chargeable: true,
    score: valid ? 92 : 18,
    findings,
    nextAgentCall: valid
      ? {
          service: "proofcup.payout.prepare",
          reason: "Verified receipt can be forwarded to payout preparation."
        }
      : undefined
  };
}
