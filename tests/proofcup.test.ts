import { describe, expect, it } from "vitest";
import { buildReceiptGateArgs, createMatchPassProof, receiptGateHash, verifyMatchPassProof } from "../src/lib/proofcup";
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
    const stellar = buildStellarAnchor(proof);
    const audit = runCrooAudit(createCrooAuditRequest(proof));
    const payout = createWdkPayoutIntent(proof.receipt, 1000);

    expect(stellar.contractMethod).toBe("verify_matchpass_receipt");
    expect(stellar.contractArgs.receiptHash).toBe("9f9255f69868fb538dd6c12a663439b807c76990e1166fbd8dc136b5c92acbaa");
    expect(makeDemoTransactionEnvelope(proof.receipt).length).toBeGreaterThan(100);
    expect(audit.accepted).toBe(true);
    expect(payout.asset).toBe("USDt");
  });

  it("binds proof artifacts into a deterministic receipt gate hash", () => {
    const proof = createMatchPassProof(demoClaim);
    const gate = buildReceiptGateArgs(proof);

    expect(receiptGateHash(proof.receipt)).toBe("9f9255f69868fb538dd6c12a663439b807c76990e1166fbd8dc136b5c92acbaa");
    expect(gate.proofHash).toBe("b08b08291214979cf02f985bfaf26e8cc1e8c119dbaad485409be58e49439931");
    expect(gate.vkHash).toBe("e315430eb8c70ea1748d083c36992f6210c9d243bb251047f727325cd07da2b1");
    expect(gate.publicInputsHash).toBe("7bf398bafb7e6d4274a46458ac1d3d2642a6c5f67d0f0c219328e1a4bf7bc63a");
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
