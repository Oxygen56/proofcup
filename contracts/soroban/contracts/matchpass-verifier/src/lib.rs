#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env};

#[contract]
pub struct MatchPassVerifier;

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Nullifier(u128),
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

    pub fn seen_nullifier(env: Env, nullifier: u128) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Nullifier(nullifier))
    }
}

mod test;
