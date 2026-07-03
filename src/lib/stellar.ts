import { Keypair, Memo, Networks, TransactionBuilder } from "@stellar/stellar-sdk";
import { buildReceiptGateArgs, type MatchPassProof, type PublicReceipt, type ReceiptGateArgs } from "./proofcup";

function demoSeed(): Buffer {
  const seed = new Uint8Array(32).fill(7);
  return typeof Buffer === "undefined" ? (seed as unknown as Buffer) : Buffer.from(seed);
}

export type StellarAnchor = {
  network: "testnet";
  source: string;
  memo: string;
  operation: "invoke_matchpass_receipt_gate";
  contractMethod: "verify_matchpass_receipt";
  contractArgs: ReceiptGateArgs;
};

export function buildStellarAnchor(proof: MatchPassProof): StellarAnchor {
  const source = Keypair.fromRawEd25519Seed(demoSeed()).publicKey();
  const receipt = proof.receipt;
  return {
    network: "testnet",
    source,
    memo: `proofcup:${receipt.nullifier.slice(0, 16)}`,
    operation: "invoke_matchpass_receipt_gate",
    contractMethod: "verify_matchpass_receipt",
    contractArgs: buildReceiptGateArgs(proof)
  };
}

export function makeDemoTransactionEnvelope(receipt: PublicReceipt): string {
  const source = Keypair.fromRawEd25519Seed(demoSeed());
  const account = {
    accountId: () => source.publicKey(),
    sequenceNumber: () => "1",
    incrementSequenceNumber: () => undefined
  };
  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET
  })
    .addMemo(Memo.text(`pc:${receipt.nullifier.slice(0, 22)}`))
    .setTimeout(30)
    .build();

  tx.sign(source);
  return tx.toXDR();
}
