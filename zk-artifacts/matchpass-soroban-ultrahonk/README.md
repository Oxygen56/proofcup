# MatchPass Soroban UltraHonk Artifacts

These artifacts are the deployed-verifier set for the Stellar testnet UltraHonk contract.

They use the same MatchPass circuit logic and public values as the main ProofCup receipt, but are generated with the reference verifier-compatible toolchain:

- Noir: `1.0.0-beta.9`
- Barretenberg: `0.87.0`
- Reference verifier: `https://github.com/yugocabrio/rs-soroban-ultrahonk`
- Reference commit: `661db07200f890b1bd9a7349ed787c70a706dd12`

## Files

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `proof` | 14592 | `43d08d9750c6fbbb6ad853b5044e569231210c916244aff007a494138e765764` |
| `public_inputs` | 128 | `e07036fa8d7fece627ecde6f3e3bfd74a48dc0241bf9d47c4b82545ea7040aab` |
| `vk` | 1760 | `a8aefdd4ae8b87767b74fa8f5335dc94b6d5c6eb67f220ed2cb43062fa293fa9` |
| `matchpass.json` | 2175 | `da9e85c3da637d5a8d17e361b2d6bf3ab5d77237d286ad4c5bb0a2dfdfa9005d` |
| `matchpass.gz` | 170 | `270b519414dccab547adb4e63b3cb7700cf0000fff2d5287091793df7c022c5b` |

## Deployed Verifier

- Contract: `CDSL73NGUOCJS5J4IDKYROO5WSTJ7Z4Z3XJ647FB6VWDH62YJHBSVZFI`
- Lab: `https://lab.stellar.org/r/testnet/contract/CDSL73NGUOCJS5J4IDKYROO5WSTJ7Z4Z3XJ647FB6VWDH62YJHBSVZFI`
- Upload tx: `ea56b96f439512aca1e4298e81bbcb70862fca7f5ef1ae8b3a6515c6edb38b5e`
- Deploy tx: `daa116ebb0e1e9c358ac078929a7776f401ec2978ce76a5d1ca57a57e868ec76`
- Verify tx: `0f28b9bb67db7fed0b436a441abb9bb8702c1a573803c16cd22fe162ad73d564`
- Verifier WASM: `target/stellar/rs_soroban_ultrahonk_matchpass_verifier.wasm`
- Verifier WASM SHA-256: `dce12a9aa49132bc30edecddcd58904d358b39e5036d779937d232fde35990d2`
