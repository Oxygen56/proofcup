# Public Links

- GitHub repository: `https://github.com/Oxygen56/proofcup`
- Live demo: `https://oxygen56.github.io/proofcup/`
- GitHub release package: `https://github.com/Oxygen56/proofcup/releases/tag/v0.1.7`
- Demo video: `https://github.com/Oxygen56/proofcup/releases/download/v0.1.5/proofcup-demo.mov`
- Stellar testnet anchor: `https://stellar.expert/explorer/testnet/tx/2fd0119b5ae81f695d81f38a29efa440e9f05009b08463071f8c942608159681`
- Deployed UltraHonk verifier: `https://lab.stellar.org/r/testnet/contract/CDSL73NGUOCJS5J4IDKYROO5WSTJ7Z4Z3XJ647FB6VWDH62YJHBSVZFI`
- UltraHonk verify tx: `https://stellar.expert/explorer/testnet/tx/0f28b9bb67db7fed0b436a441abb9bb8702c1a573803c16cd22fe162ad73d564`
- UltraHonk verifier WASM hash: `dce12a9aa49132bc30edecddcd58904d358b39e5036d779937d232fde35990d2`
- Deployed Soroban verifier: `https://lab.stellar.org/r/testnet/contract/CBNGZ5V25IPGHVBTNSM7GQSZVHDMAZCFZDTL6S2DZTDEZSYHCTKKU3MK`
- Upgraded receipt-gate WASM hash: `b9df30cfad86d0793357742c2baa22d436494488d36b35c81d8bfd16ad97f9e4`
- Receipt-gate hash: `9f9255f69868fb538dd6c12a663439b807c76990e1166fbd8dc136b5c92acbaa`

## Demo URL Status

GitHub Pages serves `https://oxygen56.github.io/proofcup/`; direct HTTP checks for the page and stable bundled assets returned `200`. The repository, release package, and deployment JSON files are the most reliable sources for the latest Soroban UltraHonk verifier evidence.

Local fallback:

```bash
pnpm install
pnpm build
pnpm preview
```

The submission package includes a full-page screenshot at `docs/screenshots/proofcup-demo-fullpage.png` and a local copy of the recorded demo at `docs/video/proofcup-demo.mov`.
