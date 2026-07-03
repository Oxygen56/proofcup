import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils";

export type PlayerClaim = {
  playerAlias: string;
  teamId: number;
  tournamentId: number;
  secret: bigint;
  rosterSalt: bigint;
  payoutAddress: string;
};

export type PublicReceipt = {
  protocol: "ProofCup MatchPass";
  teamId: number;
  tournamentId: number;
  commitment: string;
  nullifier: string;
  payoutAddressHash: string;
  issuedAt: string;
};

export type PrivateWitness = {
  secret: string;
  rosterSalt: string;
};

export type MatchPassProof = {
  receipt: PublicReceipt;
  witness: PrivateWitness;
  localProofDigest: string;
};

export const ZK_ARTIFACT_HASHES = {
  proofHash: "b08b08291214979cf02f985bfaf26e8cc1e8c119dbaad485409be58e49439931",
  vkHash: "e315430eb8c70ea1748d083c36992f6210c9d243bb251047f727325cd07da2b1",
  publicInputsHash: "7bf398bafb7e6d4274a46458ac1d3d2642a6c5f67d0f0c219328e1a4bf7bc63a"
} as const;

export type ReceiptGateArgs = {
  teamId: number;
  tournamentId: number;
  commitment: string;
  nullifier: string;
  payoutHash: string;
  proofHash: string;
  vkHash: string;
  publicInputsHash: string;
  receiptHash: string;
};

const FIELD_MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

export function field(value: bigint): bigint {
  const next = value % FIELD_MODULUS;
  return next >= 0n ? next : next + FIELD_MODULUS;
}

export function matchpassCommitment(secret: bigint, rosterSalt: bigint, teamId: number): bigint {
  return field(secret * secret + rosterSalt * rosterSalt * 7n + BigInt(teamId) * 13n);
}

export function matchpassNullifier(secret: bigint, rosterSalt: bigint, tournamentId: number): bigint {
  return field(secret * secret * 17n + BigInt(tournamentId) * 31n + rosterSalt);
}

export function digest(parts: Array<string | number | bigint>): string {
  return bytesToHex(sha256(utf8ToBytes(parts.map(String).join("|"))));
}

export function hashAddress(address: string): string {
  return digest(["payout", address]).slice(0, 40);
}

function u32Bytes(value: number): Uint8Array {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value, false);
  return bytes;
}

function u128Bytes(value: string | bigint): Uint8Array {
  let n = typeof value === "bigint" ? value : BigInt(value);
  const bytes = new Uint8Array(16);
  for (let i = 15; i >= 0; i -= 1) {
    bytes[i] = Number(n & 0xffn);
    n >>= 8n;
  }
  return bytes;
}

function concatBytes(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export function receiptGatePreimage(receipt: PublicReceipt): Uint8Array {
  return concatBytes([
    utf8ToBytes("ProofCup MatchPass|v1|"),
    u32Bytes(receipt.teamId),
    u32Bytes(receipt.tournamentId),
    u128Bytes(receipt.commitment),
    u128Bytes(receipt.nullifier),
    hexToBytes(receipt.payoutAddressHash)
  ]);
}

export function receiptGateHash(receipt: PublicReceipt): string {
  return bytesToHex(sha256(receiptGatePreimage(receipt)));
}

export function buildReceiptGateArgs(proof: MatchPassProof): ReceiptGateArgs {
  return {
    teamId: proof.receipt.teamId,
    tournamentId: proof.receipt.tournamentId,
    commitment: proof.receipt.commitment,
    nullifier: proof.receipt.nullifier,
    payoutHash: proof.receipt.payoutAddressHash,
    proofHash: ZK_ARTIFACT_HASHES.proofHash,
    vkHash: ZK_ARTIFACT_HASHES.vkHash,
    publicInputsHash: ZK_ARTIFACT_HASHES.publicInputsHash,
    receiptHash: receiptGateHash(proof.receipt)
  };
}

export function createMatchPassProof(claim: PlayerClaim, now = new Date("2026-07-02T14:30:00.000Z")): MatchPassProof {
  const commitment = matchpassCommitment(claim.secret, claim.rosterSalt, claim.teamId);
  const nullifier = matchpassNullifier(claim.secret, claim.rosterSalt, claim.tournamentId);
  const receipt: PublicReceipt = {
    protocol: "ProofCup MatchPass",
    teamId: claim.teamId,
    tournamentId: claim.tournamentId,
    commitment: commitment.toString(),
    nullifier: nullifier.toString(),
    payoutAddressHash: hashAddress(claim.payoutAddress),
    issuedAt: now.toISOString()
  };

  return {
    receipt,
    witness: {
      secret: claim.secret.toString(),
      rosterSalt: claim.rosterSalt.toString()
    },
    localProofDigest: digest([
      "matchpass-v0",
      receipt.teamId,
      receipt.tournamentId,
      receipt.commitment,
      receipt.nullifier,
      receipt.payoutAddressHash
    ])
  };
}

export function verifyMatchPassProof(proof: MatchPassProof): boolean {
  const secret = BigInt(proof.witness.secret);
  const rosterSalt = BigInt(proof.witness.rosterSalt);
  if (secret === 0n || rosterSalt === 0n) return false;

  const expectedCommitment = matchpassCommitment(secret, rosterSalt, proof.receipt.teamId).toString();
  const expectedNullifier = matchpassNullifier(secret, rosterSalt, proof.receipt.tournamentId).toString();
  const expectedDigest = digest([
    "matchpass-v0",
    proof.receipt.teamId,
    proof.receipt.tournamentId,
    proof.receipt.commitment,
    proof.receipt.nullifier,
    proof.receipt.payoutAddressHash
  ]);

  return (
    proof.receipt.protocol === "ProofCup MatchPass" &&
    proof.receipt.commitment === expectedCommitment &&
    proof.receipt.nullifier === expectedNullifier &&
    proof.localProofDigest === expectedDigest
  );
}

export function publicReceiptForSubmission(proof: MatchPassProof): PublicReceipt {
  return proof.receipt;
}
