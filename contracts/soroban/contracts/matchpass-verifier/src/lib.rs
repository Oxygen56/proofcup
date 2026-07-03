#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Bytes, BytesN, Env};

#[contract]
pub struct MatchPassVerifier;

const EXPECTED_PROOF_HASH: [u8; 32] = [
    0xb0, 0x8b, 0x08, 0x29, 0x12, 0x14, 0x97, 0x9c, 0xf0, 0x2f, 0x98, 0x5b, 0xfa, 0xf2, 0x6e, 0x8c,
    0xc1, 0xe8, 0xc1, 0x19, 0xdb, 0xaa, 0xd4, 0x85, 0x40, 0x9b, 0xe5, 0x8e, 0x49, 0x43, 0x99, 0x31,
];
const EXPECTED_VK_HASH: [u8; 32] = [
    0xe3, 0x15, 0x43, 0x0e, 0xb8, 0xc7, 0x0e, 0xa1, 0x74, 0x8d, 0x08, 0x3c, 0x36, 0x99, 0x2f, 0x62,
    0x10, 0xc9, 0xd2, 0x43, 0xbb, 0x25, 0x10, 0x47, 0xf7, 0x27, 0x32, 0x5c, 0xd0, 0x7d, 0xa2, 0xb1,
];
const EXPECTED_PUBLIC_INPUTS_HASH: [u8; 32] = [
    0x7b, 0xf3, 0x98, 0xba, 0xfb, 0x7e, 0x6d, 0x42, 0x74, 0xa4, 0x64, 0x58, 0xac, 0x1d, 0x3d, 0x26,
    0x42, 0xa6, 0xc5, 0xf6, 0x7d, 0x0f, 0x0c, 0x21, 0x93, 0x28, 0xe1, 0xa4, 0xbf, 0x7b, 0xc6, 0x3a,
];

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Nullifier(u128),
    Receipt(u128),
}

#[contractimpl]
impl MatchPassVerifier {
    pub fn verify_matchpass(
        env: Env,
        team_id: u32,
        tournament_id: u32,
        commitment: u128,
        nullifier: u128,
    ) -> bool {
        if team_id == 0 || tournament_id == 0 || commitment == 0 || nullifier == 0 {
            return false;
        }

        let key = DataKey::Nullifier(nullifier);
        if env.storage().persistent().has(&key) {
            return false;
        }

        env.storage().persistent().set(&key, &true);
        true
    }

    pub fn verify_matchpass_receipt(
        env: Env,
        team_id: u32,
        tournament_id: u32,
        commitment: u128,
        nullifier: u128,
        payout_hash: BytesN<20>,
        proof_hash: BytesN<32>,
        vk_hash: BytesN<32>,
        public_inputs_hash: BytesN<32>,
        receipt_hash: BytesN<32>,
    ) -> bool {
        if team_id == 0 || tournament_id == 0 || commitment == 0 || nullifier == 0 {
            return false;
        }
        if proof_hash != BytesN::from_array(&env, &EXPECTED_PROOF_HASH)
            || vk_hash != BytesN::from_array(&env, &EXPECTED_VK_HASH)
            || public_inputs_hash != BytesN::from_array(&env, &EXPECTED_PUBLIC_INPUTS_HASH)
        {
            return false;
        }

        let computed = Self::receipt_hash(
            env.clone(),
            team_id,
            tournament_id,
            commitment,
            nullifier,
            payout_hash.clone(),
        );
        if computed != receipt_hash {
            return false;
        }

        let nullifier_key = DataKey::Nullifier(nullifier);
        if env.storage().persistent().has(&nullifier_key) {
            return false;
        }

        env.storage().persistent().set(&nullifier_key, &true);
        env.storage().persistent().set(&DataKey::Receipt(nullifier), &receipt_hash);
        true
    }

    pub fn seen_nullifier(env: Env, nullifier: u128) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Nullifier(nullifier))
    }

    pub fn receipt_verified(env: Env, nullifier: u128, receipt_hash: BytesN<32>) -> bool {
        let stored: Option<BytesN<32>> = env.storage().persistent().get(&DataKey::Receipt(nullifier));
        stored.is_some_and(|hash| hash == receipt_hash)
    }

    pub fn expected_proof_hash(env: Env) -> BytesN<32> {
        BytesN::from_array(&env, &EXPECTED_PROOF_HASH)
    }

    pub fn expected_vk_hash(env: Env) -> BytesN<32> {
        BytesN::from_array(&env, &EXPECTED_VK_HASH)
    }

    pub fn expected_public_inputs_hash(env: Env) -> BytesN<32> {
        BytesN::from_array(&env, &EXPECTED_PUBLIC_INPUTS_HASH)
    }

    pub fn receipt_hash(
        env: Env,
        team_id: u32,
        tournament_id: u32,
        commitment: u128,
        nullifier: u128,
        payout_hash: BytesN<20>,
    ) -> BytesN<32> {
        let mut preimage = Bytes::from_slice(&env, b"ProofCup MatchPass|v1|");
        preimage.extend_from_array(&team_id.to_be_bytes());
        preimage.extend_from_array(&tournament_id.to_be_bytes());
        preimage.extend_from_array(&commitment.to_be_bytes());
        preimage.extend_from_array(&nullifier.to_be_bytes());
        let payout: Bytes = payout_hash.into();
        preimage.append(&payout);
        env.crypto().sha256(&preimage).into()
    }
}

mod test;
