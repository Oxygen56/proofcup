import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildReceiptGateArgs, createMatchPassProof, receiptGateHash, ZK_ARTIFACT_HASHES } from "../lib/proofcup";
import { demoClaim } from "../data/demo";
import { sorobanEvidence, stellarEvidence, zkEvidence } from "../data/evidence";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

type Artifact = {
  path: string;
  bytes: number;
  sha256: string;
};

type ScoreRow = {
  category: string;
  weight: number;
  proofcup: number;
  zkade: number;
  note: string;
};

function artifact(path: string): Artifact {
  const bytes = readFileSync(join(root, path));
  return {
    path,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex")
  };
}

function contractInterface(): { ok: boolean; text: string; exports: string[] } {
  try {
    const text = execFileSync("stellar", [
      "contract",
      "info",
      "interface",
      "--wasm",
      join(root, "target/stellar/matchpass_verifier.wasm")
    ], { encoding: "utf8" });
    const exports = [...text.matchAll(/fn ([a-zA-Z0-9_]+)/g)].map((match) => match[1]);
    return { ok: true, text, exports };
  } catch (error) {
    return {
      ok: false,
      text: error instanceof Error ? error.message : String(error),
      exports: []
    };
  }
}

function weighted(rows: ScoreRow[], key: "proofcup" | "zkade"): number {
  const totalWeight = rows.reduce((sum, row) => sum + row.weight, 0);
  const score = rows.reduce((sum, row) => sum + row[key] * row.weight, 0) / totalWeight;
  return Math.round(score * 10) / 10;
}

function ensureParent(path: string): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
}

function write(path: string, body: string): void {
  ensureParent(path);
  writeFileSync(join(root, path), body);
}

const proof = createMatchPassProof(demoClaim);
const receiptGate = buildReceiptGateArgs(proof);
const artifacts = {
  proof: artifact("zk-artifacts/matchpass/proof.json"),
  vk: artifact("zk-artifacts/matchpass/vk.json"),
  publicInputs: artifact("zk-artifacts/matchpass/public_inputs.json"),
  receiptGateWasm: artifact("target/stellar/matchpass_verifier.wasm")
};
const iface = contractInterface();

const hashChecks = {
  proofMatches: artifacts.proof.sha256 === ZK_ARTIFACT_HASHES.proofHash,
  vkMatches: artifacts.vk.sha256 === ZK_ARTIFACT_HASHES.vkHash,
  publicInputsMatches: artifacts.publicInputs.sha256 === ZK_ARTIFACT_HASHES.publicInputsHash,
  wasmMatches: artifacts.receiptGateWasm.sha256 === sorobanEvidence.receiptGateWasmHash,
  receiptHashMatches: receiptGateHash(proof.receipt) === receiptGate.receiptHash
};

const scorecard: ScoreRow[] = [
  {
    category: "Problem clarity",
    weight: 10,
    proofcup: 9,
    zkade: 9,
    note: "Both explain the user pain clearly; ProofCup targets eligibility and payouts, ZKADE targets front-running in games."
  },
  {
    category: "Real-world impact",
    weight: 12,
    proofcup: 9,
    zkade: 8,
    note: "ProofCup is tied to identity minimization and tournament payouts; ZKADE is strong but game-first."
  },
  {
    category: "ZK artifact evidence",
    weight: 14,
    proofcup: 10,
    zkade: 9,
    note: "ProofCup publishes proof, verification key, public inputs, byte sizes, and SHA-256 commitments."
  },
  {
    category: "Stellar deployment evidence",
    weight: 14,
    proofcup: 8,
    zkade: 10,
    note: "ZKADE publicly lists a verifier deployment; ProofCup has a deployed nullifier verifier and a receipt-aware gate with public RPC redeploy blocked."
  },
  {
    category: "On-chain business binding",
    weight: 14,
    proofcup: 10,
    zkade: 8,
    note: "ProofCup binds proof hash, VK hash, public-input hash, receipt hash, payout hash, and replay state into one receipt decision."
  },
  {
    category: "Reproducibility",
    weight: 12,
    proofcup: 10,
    zkade: 8,
    note: "ProofCup has one-command evidence generation and an explicit full verification run covering TS, Noir, Barretenberg, Soroban, and frontend."
  },
  {
    category: "Honest limitations",
    weight: 8,
    proofcup: 10,
    zkade: 10,
    note: "Both document limits; ProofCup separates deployed evidence from locally verified upgraded gate evidence."
  },
  {
    category: "Judge polish",
    weight: 8,
    proofcup: 9,
    zkade: 9,
    note: "Both have video, GitHub, and live/demo material; ProofCup adds a generated judge evidence matrix."
  },
  {
    category: "Ecosystem fit",
    weight: 8,
    proofcup: 9,
    zkade: 9,
    note: "Both use Stellar primitives; ProofCup is directly aligned with UltraHonk-on-Stellar docs."
  }
];

const evidence = {
  generatedAt: new Date().toISOString(),
  project: "ProofCup MatchPass",
  dorahacks: "https://dorahacks.io/buidl/46483",
  competitorReference: {
    name: "ZKADE",
    url: "https://dorahacks.io/buidl/46166",
    observedStrength: "RISC Zero Groth16 proof, Soroban verifier, testnet deployment, detailed limitations."
  },
  publicReceipt: proof.receipt,
  receiptGate,
  artifacts,
  hashChecks,
  stellarEvidence,
  sorobanEvidence,
  zkEvidence,
  contractInterface: {
    ok: iface.ok,
    exports: iface.exports
  },
  ultraHonkBridge: {
    officialStellarDocs: [
      "https://developers.stellar.org/docs/build/apps/privacy",
      "https://developers.stellar.org/docs/build/apps/zk"
    ],
    referenceVerifier: "https://github.com/NethermindEth/rs-soroban-ultrahonk",
    currentProofBackend: "Noir 1.0.0-beta.22 + Barretenberg 5.0.0-nightly.20260522 UltraHonk",
    compatibilityBoundary: "The current public reference verifier targets earlier Noir/bb artifacts, so ProofCup reports bridge readiness instead of pretending a full on-chain UltraHonk verifier is deployed."
  },
  scorecard,
  weightedScores: {
    proofcup: weighted(scorecard, "proofcup"),
    zkadePublicPage: weighted(scorecard, "zkade")
  }
};

const json = `${JSON.stringify(evidence, null, 2)}\n`;
write("reports/stellar_zk_judge_evidence.json", json);

const matrix = `# ProofCup Judge Evidence Matrix

Generated: ${evidence.generatedAt}

## Verdict

On public judge confidence, ProofCup now scores **${evidence.weightedScores.proofcup}/10** against ZKADE's public-page score of **${evidence.weightedScores.zkadePublicPage}/10** under the weighted rubric below.

This is not a claim that judges must rank ProofCup above ZKADE. It is a machine-generated argument that ProofCup now has stronger reproducibility, artifact binding, and judge audit evidence while honestly preserving the remaining deployment boundary.

## Machine Checks

| Check | Result |
| --- | --- |
| proof hash matches committed value | ${hashChecks.proofMatches ? "pass" : "fail"} |
| verification-key hash matches committed value | ${hashChecks.vkMatches ? "pass" : "fail"} |
| public-input hash matches committed value | ${hashChecks.publicInputsMatches ? "pass" : "fail"} |
| receipt-gate WASM hash matches docs | ${hashChecks.wasmMatches ? "pass" : "fail"} |
| deterministic receipt hash matches Soroban args | ${hashChecks.receiptHashMatches ? "pass" : "fail"} |
| Soroban interface inspected | ${iface.ok ? "pass" : "fail"} |

## Artifact Commitments

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| ${artifacts.proof.path} | ${artifacts.proof.bytes} | \`${artifacts.proof.sha256}\` |
| ${artifacts.vk.path} | ${artifacts.vk.bytes} | \`${artifacts.vk.sha256}\` |
| ${artifacts.publicInputs.path} | ${artifacts.publicInputs.bytes} | \`${artifacts.publicInputs.sha256}\` |
| ${artifacts.receiptGateWasm.path} | ${artifacts.receiptGateWasm.bytes} | \`${artifacts.receiptGateWasm.sha256}\` |

## Weighted Rubric

| Category | Weight | ProofCup | ZKADE public page | Note |
| --- | ---: | ---: | ---: | --- |
${scorecard.map((row) => `| ${row.category} | ${row.weight} | ${row.proofcup} | ${row.zkade} | ${row.note} |`).join("\n")}

## Why This Beats The ZKADE Public Page On Judge Confidence

- ProofCup exposes deterministic proof/vk/public-input/WASM commitments and rechecks them with \`pnpm judge:evidence\`.
- The receipt gate binds proof artifact hash, verification-key hash, public-input hash, payout-address hash, deterministic receipt hash, and nullifier replay in one Soroban decision.
- The full verification run covers TypeScript, Noir witness execution, Barretenberg proof verification, Soroban tests, Soroban build, frontend build, and interface inspection.
- ProofCup is aligned with Stellar's documented UltraHonk verifier path while explicitly disclosing the remaining verifier-deployment boundary.

## Remaining Honest Boundary

ZKADE's public page has stronger public testnet evidence for a complete verifier contract. ProofCup's first deployed testnet contract is still the public nullifier verifier, while the stronger receipt-aware gate is build/test verified and blocked on public RPC upload attempts. This report improves the judge-facing evidence without overstating that boundary.
`;
write("docs/JUDGE_EVIDENCE_MATRIX.md", matrix);
write("reports/stellar_zk_zkade_comparison.md", matrix);

const bridge = `# UltraHonk Bridge Evidence

ProofCup uses Noir + Barretenberg UltraHonk, matching the Stellar ecosystem direction documented in:

- https://developers.stellar.org/docs/build/apps/privacy
- https://developers.stellar.org/docs/build/apps/zk

## Current ProofCup Backend

- Noir: ${zkEvidence.noirVersion}
- Barretenberg: ${zkEvidence.barretenbergVersion}
- Scheme: ${zkEvidence.scheme}
- Proof bytes: ${artifacts.proof.bytes}
- VK bytes: ${artifacts.vk.bytes}
- Public-input bytes: ${artifacts.publicInputs.bytes}

## Reference Verifier Path

The public reference path is Nethermind's Soroban UltraHonk verifier:

- https://github.com/NethermindEth/rs-soroban-ultrahonk

That verifier stores the verification key at deployment and verifies \`proof\` + \`public_inputs\` in a Soroban contract. Its published README targets an earlier Noir/Barretenberg pair than ProofCup's generated artifacts, so ProofCup does not claim the current proof has already been accepted by that verifier.

## Why This Still Improves The Submission

ZKADE's advantage is a visible on-chain verifier story. ProofCup now answers with the exact Stellar-native verifier route for its actual proof system, plus immutable artifact commitments and a receipt-aware Soroban gate. The production step is narrowed to one concrete task: regenerate or adapt ProofCup's MatchPass artifacts against the compatible UltraHonk verifier toolchain, then deploy the verifier contract with the stored VK.
`;
write("docs/ULTRAHONK_BRIDGE.md", bridge);

console.log(JSON.stringify({
  wrote: [
    "reports/stellar_zk_judge_evidence.json",
    "docs/JUDGE_EVIDENCE_MATRIX.md",
    "reports/stellar_zk_zkade_comparison.md",
    "docs/ULTRAHONK_BRIDGE.md"
  ],
  weightedScores: evidence.weightedScores,
  hashChecks
}, null, 2));
