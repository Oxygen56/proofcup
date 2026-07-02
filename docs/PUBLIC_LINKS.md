# Public Links

- GitHub repository: `https://github.com/Oxygen56/proofcup`
- Live demo: `https://oxygen56.github.io/proofcup/`
- GitHub release package: `https://github.com/Oxygen56/proofcup/releases/tag/v0.1.5`
- Demo video: `https://github.com/Oxygen56/proofcup/releases/download/v0.1.5/proofcup-demo.mov`
- Stellar testnet anchor: `https://stellar.expert/explorer/testnet/tx/2fd0119b5ae81f695d81f38a29efa440e9f05009b08463071f8c942608159681`

## Demo URL Status

GitHub Pages serves `https://oxygen56.github.io/proofcup/`; direct HTTP checks for the page and stable bundled assets returned `200`. GitHub's Pages API still reports new dynamic builds as `errored`, so the release video and package are the most reliable sources for the latest Soroban contract evidence.

Local fallback:

```bash
pnpm install
pnpm build
pnpm preview
```

The submission package includes a full-page screenshot at `docs/screenshots/proofcup-demo-fullpage.png` and a local copy of the recorded demo at `docs/video/proofcup-demo.mov`.
