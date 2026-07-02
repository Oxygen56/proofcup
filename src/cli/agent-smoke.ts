import { once } from "node:events";
import { createProofCupAgentServer } from "../agent/server";

const server = createProofCupAgentServer();
server.listen(0, "127.0.0.1");
await once(server, "listening");

const address = server.address();
if (!address || typeof address === "string") {
  throw new Error("Unexpected server address.");
}

const baseUrl = `http://127.0.0.1:${address.port}`;
const health = await fetch(`${baseUrl}/health`).then((response) => response.json());
const sample = await fetch(`${baseUrl}/sample`).then((response) => response.json());
const audit = await fetch(`${baseUrl}/audit`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ proof: sample.proof })
}).then((response) => response.json());
const payout = await fetch(`${baseUrl}/payout-intent`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ proof: sample.proof, amountUsd: 1000 })
}).then((response) => response.json());

server.close();

console.log(JSON.stringify({
  baseUrl,
  health,
  audit,
  payout
}, null, 2));
