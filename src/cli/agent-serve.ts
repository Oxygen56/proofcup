import { listen } from "../agent/server";

const port = Number(process.env.PORT || 8787);
await listen(port);
console.log(`ProofCup CROO agent listening on http://127.0.0.1:${port}`);
