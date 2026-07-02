#![cfg(test)]

use super::*;
use soroban_sdk::Env;

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
fn rejects_zero_fields() {
    let env = Env::default();
    let contract_id = env.register(MatchPassVerifier, ());
    let client = MatchPassVerifierClient::new(&env, &contract_id);

    assert!(!client.verify_matchpass(&0, &20260703, &123456789, &1));
    assert!(!client.verify_matchpass(&7, &0, &123456789, &2));
    assert!(!client.verify_matchpass(&7, &20260703, &0, &3));
    assert!(!client.verify_matchpass(&7, &20260703, &123456789, &0));
}
