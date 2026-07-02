import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";

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
