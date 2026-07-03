# Public Links

- GitHub repository: `https://github.com/Oxygen56/proofcup`
- Live demo: `https://oxygen56.github.io/proofcup/`
- GitHub release package: `https://github.com/Oxygen56/proofcup/releases/tag/v0.1.6`
- Demo video: `https://github.com/Oxygen56/proofcup/releases/download/v0.1.5/proofcup-demo.mov`
- Stellar testnet anchor: `https://stellar.expert/explorer/testnet/tx/2fd0119b5ae81f695d81f38a29efa440e9f05009b08463071f8c942608159681`
- Deployed Soroban verifier: `https://lab.stellar.org/r/testnet/contract/CBNGZ5V25IPGHVBTNSM7GQSZVHDMAZCFZDTL6S2DZTDEZSYHCTKKU3MK`
- Upgraded receipt-gate WASM hash: `6287720697927697eddbe9e3d310c1dccfb291f48d052c231c0c5d63f15bf097`
- Receipt-gate hash: `9f9255f69868fb538dd6c12a663439b807c76990e1166fbd8dc136b5c92acbaa`

## Demo URL Status

GitHub Pages serves `https://oxygen56.github.io/proofcup/`; direct HTTP checks for the page and stable bundled assets returned `200`. GitHub's Pages API still reports new dynamic builds as `errored`, so the release video and package are the most reliable sources for the latest Soroban contract evidence.

Local fallback:

```bash
pnpm install
pnpm build
pnpm preview
```

The submission package includes a full-page screenshot at `docs/screenshots/proofcup-demo-fullpage.png` and a local copy of the recorded demo at `docs/video/proofcup-demo.mov`.
