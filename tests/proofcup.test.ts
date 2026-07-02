import { describe, expect, it } from "vitest";
import { createMatchPassProof, verifyMatchPassProof } from "../src/lib/proofcup";
import { demoClaim } from "../src/data/demo";
import { buildStellarAnchor, makeDemoTransactionEnvelope } from "../src/lib/stellar";
import { createCrooAuditRequest, runCrooAudit } from "../src/lib/croo";
import { createPayoutBatch, createWdkPayoutIntent } from "../src/lib/tether";
import { createProofCupAgentServer } from "../src/agent/server";
import { once } from "node:events";

describe("ProofCup", () => {
  it("creates and verifies a MatchPass proof", () => {
    const proof = createMatchPassProof(demoClaim);
    expect(verifyMatchPassProof(proof)).toBe(true);
  });

  it("rejects a tampered nullifier", () => {
    const proof = createMatchPassProof(demoClaim);
    proof.receipt.nullifier = "1";
    expect(verifyMatchPassProof(proof)).toBe(false);
  });

  it("builds Stellar, CROO, and Tether adapters from one receipt", () => {
    const proof = createMatchPassProof(demoClaim);
    const stellar = buildStellarAnchor(proof.receipt);
    const audit = runCrooAudit(createCrooAuditRequest(proof));
    const payout = createWdkPayoutIntent(proof.receipt, 1000);

    expect(stellar.contractMethod).toBe("verify_matchpass");
    expect(makeDemoTransactionEnvelope(proof.receipt).length).toBeGreaterThan(100);
    expect(audit.accepted).toBe(true);
    expect(payout.asset).toBe("USDt");
  });

  it("serves the CROO audit agent over HTTP", async () => {
    const server = createProofCupAgentServer();
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Unexpected address");
    }

    const proof = createMatchPassProof(demoClaim);
    const response = await fetch(`http://127.0.0.1:${address.port}/audit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ proof })
    });
    const body = await response.json() as { accepted: boolean; score: number };
    server.close();

    expect(response.status).toBe(200);
    expect(body.accepted).toBe(true);
    expect(body.score).toBeGreaterThan(90);
  });

  it("creates a policy-checked USDt payout batch", () => {
    const proof = createMatchPassProof(demoClaim);
    const batch = createPayoutBatch([
      {
        id: "final-7",
        round: "final",
        team: "Atlas FC",
        teamId: 7,
        amountUsd: 1000,
        receipt: proof.receipt
      }
    ]);

    expect(batch.totalUsd).toBe(1000);
    expect(batch.riskSummary.ready).toBe(true);
    expect(batch.intents[0]?.asset).toBe("USDt");
  });
});
