import { createMatchPassProof, publicReceiptForSubmission, verifyMatchPassProof } from "../lib/proofcup";
import { buildStellarAnchor, makeDemoTransactionEnvelope } from "../lib/stellar";
import { createCrooAuditRequest, runCrooAudit } from "../lib/croo";
import { createWdkPayoutIntent, explainTetherFit } from "../lib/tether";
import { demoClaim } from "../data/demo";

const proof = createMatchPassProof(demoClaim);
const receipt = publicReceiptForSubmission(proof);
const stellar = buildStellarAnchor(receipt);
const audit = runCrooAudit(createCrooAuditRequest(proof));
const payout = createWdkPayoutIntent(receipt, 1000);

console.log(JSON.stringify({
  proofValid: verifyMatchPassProof(proof),
  publicReceipt: receipt,
  stellarAnchor: stellar,
  stellarDemoEnvelopeXdr: makeDemoTransactionEnvelope(receipt).slice(0, 96) + "...",
  crooAudit: audit,
  tetherPayout: payout,
  tetherFit: explainTetherFit(payout)
}, null, 2));
