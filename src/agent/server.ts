import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { createMatchPassProof, type MatchPassProof } from "../lib/proofcup";
import { createCrooAuditRequest, runCrooAudit } from "../lib/croo";
import { createWdkPayoutIntent } from "../lib/tether";
import { demoClaim } from "../data/demo";

type RouteResult = {
  status: number;
  body: unknown;
};

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw.length ? JSON.parse(raw) : {};
}

async function route(req: IncomingMessage): Promise<RouteResult> {
  const method = req.method || "GET";
  const url = new URL(req.url || "/", "http://localhost");

  if (method === "GET" && url.pathname === "/health") {
    return {
      status: 200,
      body: {
        ok: true,
        service: "proofcup.matchpass.audit",
        capVersion: "0.1"
      }
    };
  }

  if (method === "GET" && url.pathname === "/sample") {
    const proof = createMatchPassProof(demoClaim);
    return {
      status: 200,
      body: {
        proof,
        auditRequest: createCrooAuditRequest(proof),
        payoutIntent: createWdkPayoutIntent(proof.receipt, 1000)
      }
    };
  }

  if (method === "POST" && url.pathname === "/audit") {
    const body = await readJson(req);
    const proof = (body as { proof?: MatchPassProof; input?: MatchPassProof }).proof || (body as { input?: MatchPassProof }).input;
    if (!proof) {
      return { status: 400, body: { error: "Expected proof or input field." } };
    }
    return {
      status: 200,
      body: runCrooAudit(createCrooAuditRequest(proof))
    };
  }

  if (method === "POST" && url.pathname === "/payout-intent") {
    const body = await readJson(req) as { proof?: MatchPassProof; amountUsd?: number };
    if (!body.proof) {
      return { status: 400, body: { error: "Expected proof field." } };
    }
    return {
      status: 200,
      body: createWdkPayoutIntent(body.proof.receipt, body.amountUsd || 1000)
    };
  }

  return { status: 404, body: { error: "Not found" } };
}

export function createProofCupAgentServer(): Server {
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const result = await route(req);
      res.writeHead(result.status, { "content-type": "application/json" });
      res.end(JSON.stringify(result.body, null, 2));
    } catch (error) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
    }
  });
}

export async function listen(port = Number(process.env.PORT || 8787)): Promise<Server> {
  const server = createProofCupAgentServer();
  await new Promise<void>((resolve) => server.listen(port, "127.0.0.1", resolve));
  return server;
}
