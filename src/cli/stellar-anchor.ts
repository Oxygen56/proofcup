import { Horizon, Keypair, Memo, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { mkdir, writeFile } from "node:fs/promises";
import { setGlobalDispatcher, ProxyAgent } from "undici";
import { createMatchPassProof, digest } from "../lib/proofcup";
import { demoClaim } from "../data/demo";

const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY;
if (proxy?.startsWith("http://") || proxy?.startsWith("https://")) {
  setGlobalDispatcher(new ProxyAgent(proxy));
}

const server = new Horizon.Server("https://horizon-testnet.stellar.org");
const keypair = Keypair.random();
const proof = createMatchPassProof(demoClaim);
const receiptHash = digest([
  "stellar-anchor",
  proof.receipt.teamId,
  proof.receipt.tournamentId,
  proof.receipt.commitment,
  proof.receipt.nullifier,
  proof.receipt.payoutAddressHash
]);

async function fundAccount(publicKey: string) {
  const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
  if (!response.ok) {
    throw new Error(`Friendbot failed: ${response.status} ${await response.text()}`);
  }
}

async function main() {
  await fundAccount(keypair.publicKey());
  const account = await server.loadAccount(keypair.publicKey());
  const fee = await server.fetchBaseFee();
  const tx = new TransactionBuilder(account, {
    fee: String(fee),
    networkPassphrase: Networks.TESTNET
  })
    .addMemo(Memo.text(`pc:${proof.receipt.nullifier.slice(0, 22)}`))
    .addOperation(
      Operation.manageData({
        name: "proofcup.matchpass.sha256",
        value: receiptHash
      })
    )
    .setTimeout(120)
    .build();

  tx.sign(keypair);
  const submitted = await server.submitTransaction(tx);

  const result = {
    network: "stellar-testnet",
    account: keypair.publicKey(),
    transactionHash: submitted.hash,
    ledger: submitted.ledger,
    receiptHash,
    explorer: `https://stellar.expert/explorer/testnet/tx/${submitted.hash}`,
    receipt: proof.receipt
  };

  await mkdir("deployments", { recursive: true });
  await writeFile("deployments/stellar-testnet-latest.json", JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
