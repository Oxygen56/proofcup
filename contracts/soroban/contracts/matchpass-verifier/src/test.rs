#![cfg(test)]

use super::*;
use soroban_sdk::{BytesN, Env};

const PAYOUT_HASH: [u8; 20] = [
    0x37, 0x4b, 0xa7, 0xdb, 0x57, 0x7f, 0x24, 0xc3, 0x8b, 0xbd, 0xe4, 0x69, 0xf8, 0x94, 0x60, 0x5b,
    0x00, 0xad, 0x5b, 0x1e,
];
const RECEIPT_HASH: [u8; 32] = [
    0x9f, 0x92, 0x55, 0xf6, 0x98, 0x68, 0xfb, 0x53, 0x8d, 0xd6, 0xc1, 0x2a, 0x66, 0x34, 0x39, 0xb8,
    0x07, 0xc7, 0x69, 0x90, 0xe1, 0x16, 0x6f, 0xbd, 0x8d, 0xc1, 0x36, 0xb5, 0xc9, 0x2a, 0xcb, 0xaa,
];

#[test]
fn accepts_once_and_rejects_duplicate_nullifier() {
    let env = Env::default();
    let contract_id = env.register(MatchPassVerifier, ());
    let client = MatchPassVerifierClient::new(&env, &contract_id);

    assert!(client.verify_matchpass(&7, &20260703, &123456789, &987654321));
    assert!(client.seen_nullifier(&987654321));
    assert!(!client.verify_matchpass(&7, &20260703, &123456789, &987654321));
}

#[test]
fn verifies_full_receipt_gate_and_records_hash() {
    let env = Env::default();
    let contract_id = env.register(MatchPassVerifier, ());
    let client = MatchPassVerifierClient::new(&env, &contract_id);
    let payout_hash = BytesN::from_array(&env, &PAYOUT_HASH);
    let receipt_hash = BytesN::from_array(&env, &RECEIPT_HASH);

    assert_eq!(
        client.receipt_hash(&7, &20260703, &12_514_838, &628_113_118, &payout_hash),
        receipt_hash
    );
    assert!(client.verify_matchpass_receipt(
        &7,
        &20260703,
        &12_514_838,
        &628_113_118,
        &payout_hash,
        &client.expected_proof_hash(),
        &client.expected_vk_hash(),
        &client.expected_public_inputs_hash(),
        &receipt_hash,
    ));
    assert!(client.receipt_verified(&628_113_118, &receipt_hash));
    assert!(!client.verify_matchpass_receipt(
        &7,
        &20260703,
        &12_514_838,
        &628_113_118,
        &payout_hash,
        &client.expected_proof_hash(),
        &client.expected_vk_hash(),
        &client.expected_public_inputs_hash(),
        &receipt_hash,
    ));
}

#[test]
fn rejects_tampered_hashes_before_nullifier_write() {
    let env = Env::default();
    let contract_id = env.register(MatchPassVerifier, ());
    let client = MatchPassVerifierClient::new(&env, &contract_id);
    let payout_hash = BytesN::from_array(&env, &PAYOUT_HASH);
    let receipt_hash = BytesN::from_array(&env, &RECEIPT_HASH);
    let bad_hash = BytesN::from_array(&env, &[9u8; 32]);

    assert!(!client.verify_matchpass_receipt(
        &7,
        &20260703,
        &12_514_838,
        &628_113_118,
        &payout_hash,
        &bad_hash,
        &client.expected_vk_hash(),
        &client.expected_public_inputs_hash(),
        &receipt_hash,
    ));
    assert!(!client.seen_nullifier(&628_113_118));
    assert!(!client.verify_matchpass_receipt(
        &7,
        &20260703,
        &12_514_838,
        &628_113_118,
        &payout_hash,
        &client.expected_proof_hash(),
        &client.expected_vk_hash(),
        &client.expected_public_inputs_hash(),
        &bad_hash,
    ));
    assert!(!client.seen_nullifier(&628_113_118));
}

#[test]
fn rejects_zero_fields() {
    let env = Env::default();
    let contract_id = env.register(MatchPassVerifier, ());
    let client = MatchPassVerifierClient::new(&env, &contract_id);

    assert!(!client.verify_matchpass(&0, &20260703, &123456789, &1));
    assert!(!client.verify_matchpass(&7, &0, &123456789, &2));
    assert!(!client.verify_matchpass(&7, &20260703, &0, &3));
    assert!(!client.verify_matchpass(&7, &20260703, &123456789, &0));
}
