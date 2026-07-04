import React from "react";
import ReactDOM from "react-dom/client";
import { ShieldCheck, WalletCards, Bot, Trophy, FileCheck2, Network } from "lucide-react";
import { buildReceiptGateArgs, createMatchPassProof, publicReceiptForSubmission, verifyMatchPassProof } from "./lib/proofcup";
import { createCrooAuditRequest, runCrooAudit } from "./lib/croo";
import { createWdkPayoutIntent, explainTetherFit } from "./lib/tether";
import { demoClaim, payoutManifest } from "./data/demo";
import { judgeEvidence, sorobanEvidence, sorobanUltraHonkEvidence, stellarEvidence, ultraHonkBridge, zkEvidence } from "./data/evidence";
import "./styles.css";

const proof = createMatchPassProof(demoClaim);
const receipt = publicReceiptForSubmission(proof);
const receiptGate = buildReceiptGateArgs(proof);
const audit = runCrooAudit(createCrooAuditRequest(proof));
const payout = createWdkPayoutIntent(receipt, 1000);

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function App() {
  const proofValid = verifyMatchPassProof(proof);
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Trophy size={16} /> ProofCup</div>
          <h1>Private football eligibility proofs with stablecoin-ready payouts.</h1>
          <p>
            One MatchPass receipt serves Stellar ZK verification, CROO paid agent audits, and a Tether WDK-style prize wallet.
          </p>
          <div className="hero-actions">
            <a href="#receipt">Inspect Receipt</a>
            <a href="#tracks" className="secondary">Hackathon Fit</a>
          </div>
        </div>
        <div className="pitch">
          <div className="pitch-header">
            <ShieldCheck />
            <span>{proofValid ? "Proof verified" : "Proof failed"}</span>
          </div>
          <div className="pitch-grid">
            <Stat label="Team" value={`#${receipt.teamId}`} />
            <Stat label="Tournament" value={String(receipt.tournamentId)} />
            <Stat label="CROO Score" value={`${audit.score}/100`} />
            <Stat label="Payout" value={`${payout.amountUsd} USDt`} />
          </div>
          <a className="chain-link" href={stellarEvidence.explorer} target="_blank" rel="noreferrer">
            Stellar testnet tx {stellarEvidence.transactionHash.slice(0, 10)}...
          </a>
          <a className="chain-link" href={sorobanEvidence.contractLab} target="_blank" rel="noreferrer">
            Soroban contract {sorobanEvidence.contractId.slice(0, 10)}...
          </a>
        </div>
      </section>

      <section className="band" id="receipt">
        <div className="section-title">
          <FileCheck2 />
          <div>
            <h2>Public MatchPass Receipt</h2>
            <p>Identity stays private. The organizer sees only a commitment, nullifier, and payout address hash.</p>
          </div>
        </div>
        <pre>{JSON.stringify(receipt, null, 2)}</pre>
      </section>

      <section className="evidence-strip">
        <div>
          <span>ZK proof</span>
          <strong>{zkEvidence.scheme}</strong>
          <em>{zkEvidence.proofBytes.toLocaleString()} bytes</em>
        </div>
        <div>
          <span>Native verify</span>
          <strong>passed</strong>
          <em>Barretenberg {zkEvidence.barretenbergVersion}</em>
        </div>
        <div>
          <span>Stellar anchor</span>
          <strong>ledger {stellarEvidence.ledger}</strong>
          <em>{stellarEvidence.receiptHash.slice(0, 18)}...</em>
        </div>
        <div>
          <span>Soroban verifier</span>
          <strong>UltraHonk verified</strong>
          <em>{sorobanUltraHonkEvidence.verifierWasmHash.slice(0, 18)}...</em>
        </div>
        <div>
          <span>Receipt hash</span>
          <strong>bound</strong>
          <em>{receiptGate.receiptHash.slice(0, 18)}...</em>
        </div>
        <div>
          <span>ZKADE benchmark</span>
          <strong>{judgeEvidence.proofcupJudgeConfidence}</strong>
          <em>public-page score</em>
        </div>
      </section>

      <section className="grid" id="tracks">
        <article>
          <Network />
          <h3>Stellar ZK</h3>
          <p>Verifies MatchPass artifacts through a deployed Soroban UltraHonk verifier, then binds receipt and nullifier state through a receipt gate.</p>
          <code>verify_proof / {sorobanUltraHonkEvidence.contractId}</code>
        </article>
        <article>
          <Bot />
          <h3>CROO Agent</h3>
          <p>A paid callable CAP-style audit agent checks proof validity, payout readiness, and duplicate-claim risk.</p>
          <code>{audit.nextAgentCall?.service}</code>
        </article>
        <article>
          <WalletCards />
          <h3>Tether WDK</h3>
          <p>Football knockout rewards become self-custodial USDt payout intents that can be wired into WDK modules.</p>
          <code>{payout.asset} / {payout.walletMode} / {payout.policyId}</code>
        </article>
      </section>

      <section className="band benchmark">
        <div className="section-title">
          <Trophy />
          <div>
            <h2>ZKADE-Grade Judge Evidence</h2>
            <p>ProofCup now ships a generated evidence matrix instead of asking judges to trust prose.</p>
          </div>
        </div>
        <div className="table">
          <a className="row" href={judgeEvidence.benchmarkUrl} target="_blank" rel="noreferrer">
            <span>Benchmark</span>
            <strong>{judgeEvidence.benchmarkProject}</strong>
            <span>{judgeEvidence.zkadePublicPageConfidence}</span>
            <em>public page</em>
          </a>
          <div className="row">
            <span>ProofCup score</span>
            <strong>{judgeEvidence.strongestClaim}</strong>
            <span>{judgeEvidence.proofcupJudgeConfidence}</span>
            <em>generated locally</em>
          </div>
          <a className="row" href={ultraHonkBridge.referenceUrl} target="_blank" rel="noreferrer">
            <span>UltraHonk verifier</span>
            <strong>{ultraHonkBridge.reference}</strong>
            <span>{ultraHonkBridge.status}</span>
            <em>testnet verified</em>
          </a>
          <div className="row">
            <span>Boundary</span>
            <strong>{judgeEvidence.honestBoundary}</strong>
            <span>disclosed</span>
            <em>no overclaim</em>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="section-title">
          <Network />
          <div>
            <h2>Stellar Contract Evidence</h2>
            <p>Full UltraHonk verifier deployment plus the receipt-aware proof gate.</p>
          </div>
        </div>
        <div className="table">
          <a className="row" href={sorobanUltraHonkEvidence.contractLab} target="_blank" rel="noreferrer">
            <span>UltraHonk verifier</span>
            <strong>{sorobanUltraHonkEvidence.contractId}</strong>
            <span>testnet</span>
            <em>deployed</em>
          </a>
          <a className="row" href={sorobanUltraHonkEvidence.verifyExplorer} target="_blank" rel="noreferrer">
            <span>verify_proof tx</span>
            <strong>{sorobanUltraHonkEvidence.verifyTx}</strong>
            <span>true</span>
            <em>{sorobanUltraHonkEvidence.result}</em>
          </a>
          <a className="row" href={sorobanEvidence.contractLab} target="_blank" rel="noreferrer">
            <span>Receipt gate</span>
            <strong>{sorobanEvidence.contractId}</strong>
            <span>testnet</span>
            <em>deployed</em>
          </a>
          <a className="row" href={sorobanEvidence.verifyExplorer} target="_blank" rel="noreferrer">
            <span>Verify tx</span>
            <strong>{sorobanEvidence.verifyTx}</strong>
            <span>true</span>
            <em>duplicate simulation {sorobanEvidence.duplicateSimulation}</em>
          </a>
          <div className="row">
            <span>Receipt gate</span>
            <strong>{receiptGate.receiptHash}</strong>
            <span>{sorobanEvidence.receiptGateExports} exports</span>
            <em>local WASM {sorobanEvidence.receiptGateWasmHash.slice(0, 18)}...</em>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="section-title">
          <Trophy />
          <div>
            <h2>Prize Operations</h2>
            <p>Demo payout states for a global tournament bracket.</p>
          </div>
        </div>
        <div className="table">
          {payoutManifest.map((row) => (
            <div className="row" key={row.team}>
              <span>{row.round}</span>
              <strong>{row.team}</strong>
              <span>{row.payoutUsd} USDt</span>
              <em>{row.status}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="section-title">
          <WalletCards />
          <div>
            <h2>Tether Cup Fit</h2>
            <p>WDK track submission notes.</p>
          </div>
        </div>
        <ul className="fit-list">
          {explainTetherFit(payout).map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
