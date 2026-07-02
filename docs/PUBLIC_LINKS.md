# Public Links

- GitHub repository: `https://github.com/Oxygen56/proofcup`
- GitHub release package: `https://github.com/Oxygen56/proofcup/releases/tag/v0.1.3`
- Demo video: `https://github.com/Oxygen56/proofcup/releases/download/v0.1.3/proofcup-demo.mov`
- Stellar testnet anchor: `https://stellar.expert/explorer/testnet/tx/2fd0119b5ae81f695d81f38a29efa440e9f05009b08463071f8c942608159681`

## Demo URL Status

GitHub Pages is configured for `https://oxygen56.github.io/proofcup/`, but the Pages build is currently returning `errored` from GitHub's API. The reliable demo path for submission is:

```bash
pnpm install
pnpm build
pnpm preview
```

The submission package includes a full-page screenshot at `docs/screenshots/proofcup-demo-fullpage.png` and a local copy of the recorded demo at `docs/video/proofcup-demo.mov`.
