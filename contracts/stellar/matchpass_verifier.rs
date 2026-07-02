#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

// Soroban verifier interface for the Stellar ZK submission.
//
// The local demo compiles the Noir circuit and emits a public receipt. A full
// deployment wires this method to Stellar Protocol 25/26 BN254 verifier calls
// or to a generated Noir verifier once the deployment toolchain is installed.
#[contract]
pub struct MatchPassVerifier;

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

        let key: Symbol = symbol_short!("used");
        let nullifier_key = (key, nullifier);
        if env.storage().persistent().has(&nullifier_key) {
            return false;
        }

        env.storage().persistent().set(&nullifier_key, &true);
        true
    }
}
