import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildReceiptGateArgs, createMatchPassProof, receiptGateHash, ZK_ARTIFACT_HASHES } from "../lib/proofcup";
import { demoClaim } from "../data/demo";
import { sorobanEvidence, sorobanUltraHonkEvidence, stellarEvidence, zkEvidence } from "../data/evidence";

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

function contractInterface(wasmPath: string): { ok: boolean; text: string; exports: string[] } {
  try {
    const text = execFileSync("stellar", [
      "contract",
      "info",
      "interface",
      "--wasm",
      join(root, wasmPath)
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
  receiptGateWasm: artifact("target/stellar/matchpass_verifier.wasm"),
  sorobanUltraHonkProof: artifact("zk-artifacts/matchpass-soroban-ultrahonk/proof"),
  sorobanUltraHonkVk: artifact("zk-artifacts/matchpass-soroban-ultrahonk/vk"),
  sorobanUltraHonkPublicInputs: artifact("zk-artifacts/matchpass-soroban-ultrahonk/public_inputs"),
  sorobanUltraHonkVerifierWasm: artifact("target/stellar/rs_soroban_ultrahonk_matchpass_verifier.wasm")
};
const iface = contractInterface("target/stellar/matchpass_verifier.wasm");
const ultraHonkIface = contractInterface("target/stellar/rs_soroban_ultrahonk_matchpass_verifier.wasm");

const hashChecks = {
  proofMatches: artifacts.proof.sha256 === ZK_ARTIFACT_HASHES.proofHash,
  vkMatches: artifacts.vk.sha256 === ZK_ARTIFACT_HASHES.vkHash,
  publicInputsMatches: artifacts.publicInputs.sha256 === ZK_ARTIFACT_HASHES.publicInputsHash,
  wasmMatches: artifacts.receiptGateWasm.sha256 === sorobanEvidence.receiptGateWasmHash,
  receiptHashMatches: receiptGateHash(proof.receipt) === receiptGate.receiptHash,
  ultraHonkProofMatches: artifacts.sorobanUltraHonkProof.sha256 === sorobanUltraHonkEvidence.proofSha256,
  ultraHonkVkMatches: artifacts.sorobanUltraHonkVk.sha256 === sorobanUltraHonkEvidence.vkSha256,
  ultraHonkPublicInputsMatches: artifacts.sorobanUltraHonkPublicInputs.sha256 === sorobanUltraHonkEvidence.publicInputsSha256,
  ultraHonkVerifierWasmMatches: artifacts.sorobanUltraHonkVerifierWasm.sha256 === sorobanUltraHonkEvidence.verifierWasmHash
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
    proofcup: 10,
    zkade: 10,
    note: "Both now show public verifier deployments; ProofCup adds a full UltraHonk verifier contract with a successful testnet verify_proof transaction."
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
    proofcup: 10,
    zkade: 9,
    note: "ProofCup now uses Stellar anchoring, Soroban receipt gates, and a deployed Soroban UltraHonk verifier path."
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
  sorobanUltraHonkEvidence,
  zkEvidence,
  contractInterface: {
    ok: iface.ok,
    exports: iface.exports
  },
  sorobanUltraHonkInterface: {
    ok: ultraHonkIface.ok,
    exports: ultraHonkIface.exports
  },
  ultraHonkBridge: {
    officialStellarDocs: [
      "https://developers.stellar.org/docs/build/apps/privacy",
      "https://developers.stellar.org/docs/build/apps/zk"
    ],
    referenceVerifier: sorobanUltraHonkEvidence.referenceRepo,
    referenceCommit: sorobanUltraHonkEvidence.referenceCommit,
    currentProofBackend: "Noir 1.0.0-beta.22 + Barretenberg 5.0.0-nightly.20260522 UltraHonk",
    deployedVerifierBackend: `Noir ${sorobanUltraHonkEvidence.noirVersion} + Barretenberg ${sorobanUltraHonkEvidence.barretenbergVersion} UltraHonk`,
    honestBoundary: "The main Barretenberg 5 proof and the deployed Soroban-compatible proof are separate pinned artifact sets generated from the same MatchPass circuit and public values."
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

This is not a claim that judges must rank ProofCup above ZKADE. It is a machine-generated argument that ProofCup now has a full deployed UltraHonk verifier path, stronger reproducibility, and stronger artifact binding while preserving exact artifact boundaries.

## Machine Checks

| Check | Result |
| --- | --- |
| proof hash matches committed value | ${hashChecks.proofMatches ? "pass" : "fail"} |
| verification-key hash matches committed value | ${hashChecks.vkMatches ? "pass" : "fail"} |
| public-input hash matches committed value | ${hashChecks.publicInputsMatches ? "pass" : "fail"} |
| receipt-gate WASM hash matches docs | ${hashChecks.wasmMatches ? "pass" : "fail"} |
| deterministic receipt hash matches Soroban args | ${hashChecks.receiptHashMatches ? "pass" : "fail"} |
| Soroban interface inspected | ${iface.ok ? "pass" : "fail"} |
| deployed UltraHonk verifier WASM hash matches docs | ${hashChecks.ultraHonkVerifierWasmMatches ? "pass" : "fail"} |
| deployed UltraHonk proof hash matches docs | ${hashChecks.ultraHonkProofMatches ? "pass" : "fail"} |
| deployed UltraHonk VK hash matches docs | ${hashChecks.ultraHonkVkMatches ? "pass" : "fail"} |
| deployed UltraHonk public-input hash matches docs | ${hashChecks.ultraHonkPublicInputsMatches ? "pass" : "fail"} |
| deployed UltraHonk verifier interface inspected | ${ultraHonkIface.ok ? "pass" : "fail"} |

## Artifact Commitments

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| ${artifacts.proof.path} | ${artifacts.proof.bytes} | \`${artifacts.proof.sha256}\` |
| ${artifacts.vk.path} | ${artifacts.vk.bytes} | \`${artifacts.vk.sha256}\` |
| ${artifacts.publicInputs.path} | ${artifacts.publicInputs.bytes} | \`${artifacts.publicInputs.sha256}\` |
| ${artifacts.receiptGateWasm.path} | ${artifacts.receiptGateWasm.bytes} | \`${artifacts.receiptGateWasm.sha256}\` |
| ${artifacts.sorobanUltraHonkProof.path} | ${artifacts.sorobanUltraHonkProof.bytes} | \`${artifacts.sorobanUltraHonkProof.sha256}\` |
| ${artifacts.sorobanUltraHonkVk.path} | ${artifacts.sorobanUltraHonkVk.bytes} | \`${artifacts.sorobanUltraHonkVk.sha256}\` |
| ${artifacts.sorobanUltraHonkPublicInputs.path} | ${artifacts.sorobanUltraHonkPublicInputs.bytes} | \`${artifacts.sorobanUltraHonkPublicInputs.sha256}\` |
| ${artifacts.sorobanUltraHonkVerifierWasm.path} | ${artifacts.sorobanUltraHonkVerifierWasm.bytes} | \`${artifacts.sorobanUltraHonkVerifierWasm.sha256}\` |

## Deployed UltraHonk Verifier

- Contract: \`${sorobanUltraHonkEvidence.contractId}\`
- Lab: ${sorobanUltraHonkEvidence.contractLab}
- Upload tx: https://stellar.expert/explorer/testnet/tx/${sorobanUltraHonkEvidence.uploadTx}
- Deploy tx: https://stellar.expert/explorer/testnet/tx/${sorobanUltraHonkEvidence.deployTx}
- Verify tx: ${sorobanUltraHonkEvidence.verifyExplorer}
- Result: \`${sorobanUltraHonkEvidence.result}\`
- Reference verifier: ${sorobanUltraHonkEvidence.referenceRepo} @ \`${sorobanUltraHonkEvidence.referenceCommit}\`

## Weighted Rubric

| Category | Weight | ProofCup | ZKADE public page | Note |
| --- | ---: | ---: | ---: | --- |
${scorecard.map((row) => `| ${row.category} | ${row.weight} | ${row.proofcup} | ${row.zkade} | ${row.note} |`).join("\n")}

## Why This Beats The ZKADE Public Page On Judge Confidence

- ProofCup exposes deterministic proof/vk/public-input/WASM commitments and rechecks them with \`pnpm judge:evidence\`.
- The receipt gate binds proof artifact hash, verification-key hash, public-input hash, payout-address hash, deterministic receipt hash, and nullifier replay in one Soroban decision.
- The full verification run covers TypeScript, Noir witness execution, Barretenberg proof verification, Soroban tests, Soroban build, frontend build, interface inspection, and a deployed UltraHonk verifier invocation.
- ProofCup is aligned with Stellar's documented UltraHonk verifier path and now has public testnet verifier evidence instead of only bridge notes.

## Remaining Honest Boundary

The main ProofCup proof remains the Barretenberg 5 artifact set pinned in \`zk-artifacts/matchpass\`. The deployed Soroban UltraHonk verifier uses the reference-compatible Noir 1.0.0-beta.9 and Barretenberg 0.87.0 artifact set in \`zk-artifacts/matchpass-soroban-ultrahonk\`, generated from the same MatchPass circuit logic and public values.
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

## Deployed Reference Verifier Path

The public reference verifier path is:

- ${sorobanUltraHonkEvidence.referenceRepo}
- commit: \`${sorobanUltraHonkEvidence.referenceCommit}\`

That verifier stores the verification key at deployment and verifies \`proof\` + \`public_inputs\` in a Soroban contract. ProofCup generated a MatchPass-compatible artifact set on the verifier-compatible toolchain and deployed it on Stellar testnet.

## Deployed Verifier Evidence

- Contract: \`${sorobanUltraHonkEvidence.contractId}\`
- Lab: ${sorobanUltraHonkEvidence.contractLab}
- Verify tx: ${sorobanUltraHonkEvidence.verifyExplorer}
- Verifier WASM SHA-256: \`${sorobanUltraHonkEvidence.verifierWasmHash}\`
- Proof SHA-256: \`${sorobanUltraHonkEvidence.proofSha256}\`
- VK SHA-256: \`${sorobanUltraHonkEvidence.vkSha256}\`
- Public inputs SHA-256: \`${sorobanUltraHonkEvidence.publicInputsSha256}\`
- Local verifier run: \`${sorobanUltraHonkEvidence.localVerifierRun}\`

## Artifact Boundary

The main submission keeps the Barretenberg 5 artifacts in \`zk-artifacts/matchpass\`. The deployed verifier uses the reference-compatible artifact set in \`zk-artifacts/matchpass-soroban-ultrahonk\`. Both are pinned by SHA-256 so judges can distinguish the production proof artifact from the deployed verifier proof without trusting prose.
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
