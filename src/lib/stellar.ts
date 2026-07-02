import { Keypair, Memo, Networks, TransactionBuilder } from "@stellar/stellar-sdk";
import type { PublicReceipt } from "./proofcup";

function demoSeed(): Buffer {
  const seed = new Uint8Array(32).fill(7);
  return typeof Buffer === "undefined" ? (seed as unknown as Buffer) : Buffer.from(seed);
}

export type StellarAnchor = {
  network: "testnet";
  source: string;
  memo: string;
  operation: "invoke_matchpass_verifier";
  contractMethod: "verify_matchpass";
  contractArgs: {
    teamId: number;
    tournamentId: number;
    commitment: string;
    nullifier: string;
  };
};

export function buildStellarAnchor(receipt: PublicReceipt): StellarAnchor {
  const source = Keypair.fromRawEd25519Seed(demoSeed()).publicKey();
  return {
    network: "testnet",
    source,
    memo: `proofcup:${receipt.nullifier.slice(0, 16)}`,
    operation: "invoke_matchpass_verifier",
    contractMethod: "verify_matchpass",
    contractArgs: {
      teamId: receipt.teamId,
      tournamentId: receipt.tournamentId,
      commitment: receipt.commitment,
      nullifier: receipt.nullifier
    }
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
