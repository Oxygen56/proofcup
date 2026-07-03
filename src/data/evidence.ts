export const stellarEvidence = {
  network: "stellar-testnet",
  account: "GCARXKETTRKEVPBVBK2SXAMMD4B2EC2AFREMMX7ZIQH4KUUAOOFAOXRS",
  transactionHash: "2fd0119b5ae81f695d81f38a29efa440e9f05009b08463071f8c942608159681",
  ledger: 3398245,
  receiptHash: "f00988fe981d9a1f3c1fb6834e70cee75493b9e543c54b7a98d078ceb9f30a22",
  explorer: "https://stellar.expert/explorer/testnet/tx/2fd0119b5ae81f695d81f38a29efa440e9f05009b08463071f8c942608159681"
};

export const sorobanEvidence = {
  contractId: "CBNGZ5V25IPGHVBTNSM7GQSZVHDMAZCFZDTL6S2DZTDEZSYHCTKKU3MK",
  contractLab: "https://lab.stellar.org/r/testnet/contract/CBNGZ5V25IPGHVBTNSM7GQSZVHDMAZCFZDTL6S2DZTDEZSYHCTKKU3MK",
  wasmHash: "00ab41ca13a91887708f3e6f288c07f79aacc2922f6a85bd5eb838f932994603",
  receiptGateWasmHash: "b9df30cfad86d0793357742c2baa22d436494488d36b35c81d8bfd16ad97f9e4",
  receiptGateExports: 8,
  receiptGateStatus: "local-build-verified",
  uploadTx: "4ea12b85852773534e3545369721817f170b9f5bbee92a788e582ba340a11776",
  deployTx: "76bb73b269c1364ec913cca999eaedecaeb8937ab2b0bb432c24bc22bd803758",
  verifyTx: "cd5cee33bdedfbb1c6283718d1e384a8f8244046025d35068feed708157c4fa6",
  verifyExplorer: "https://stellar.expert/explorer/testnet/tx/cd5cee33bdedfbb1c6283718d1e384a8f8244046025d35068feed708157c4fa6",
  duplicateSimulation: "false"
};

export const zkEvidence = {
  noirVersion: "1.0.0-beta.22",
  barretenbergVersion: "5.0.0-nightly.20260522",
  scheme: "ultra_honk",
  proofBytes: 9948,
  vkBytes: 4215,
  proofSha256: "b08b08291214979cf02f985bfaf26e8cc1e8c119dbaad485409be58e49439931",
  vkSha256: "e315430eb8c70ea1748d083c36992f6210c9d243bb251047f727325cd07da2b1",
  publicInputsSha256: "7bf398bafb7e6d4274a46458ac1d3d2642a6c5f67d0f0c219328e1a4bf7bc63a",
  receiptGateHash: "9f9255f69868fb538dd6c12a663439b807c76990e1166fbd8dc136b5c92acbaa"
};

export const judgeEvidence = {
  generatedReport: "docs/JUDGE_EVIDENCE_MATRIX.md",
  jsonReport: "reports/stellar_zk_judge_evidence.json",
  benchmarkProject: "ZKADE",
  benchmarkUrl: "https://dorahacks.io/buidl/46166",
  proofcupJudgeConfidence: "9.3/10",
  zkadePublicPageConfidence: "8.8/10",
  strongestClaim: "stronger reproducibility, artifact binding, and judge audit evidence than the ZKADE public page",
  honestBoundary: "ZKADE still has stronger public testnet evidence for a complete verifier contract; ProofCup's upgraded receipt gate is build/test verified and ready for redeploy."
};

export const ultraHonkBridge = {
  reference: "Nethermind rs-soroban-ultrahonk",
  referenceUrl: "https://github.com/NethermindEth/rs-soroban-ultrahonk",
  stellarDocs: "https://developers.stellar.org/docs/build/apps/privacy",
  status: "bridge-ready",
  boundary: "reference verifier currently targets earlier Noir/Barretenberg artifacts, so ProofCup does not overclaim full on-chain UltraHonk verification."
};
