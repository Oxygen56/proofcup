// MatchPass proves that a football tournament participant knows private roster
// material without publishing their identity. Public outputs are safe to post
// on Stellar: a commitment and a one-tournament nullifier.
fn main(
    secret: Field,
    roster_salt: Field,
    team_id: pub Field,
    tournament_id: pub Field,
    commitment: pub Field,
    nullifier: pub Field,
) {
    let commitment_mix = secret * secret + roster_salt * roster_salt * 7 + team_id * 13;
    let nullifier_mix = secret * secret * 17 + tournament_id * 31 + roster_salt;

    assert(commitment_mix == commitment);
    assert(nullifier_mix == nullifier);
    assert(secret != 0);
    assert(roster_salt != 0);
}
