# Brave core + curated ads
Implemented a decentralized curation model for the Brave ads network.

Major modifications:
1. Extension
  * `web3Wrapper.ts`: interfaces with the Metamask provider to interact with the ranking contract.
  * `content.ts`: added event listeners to handle messaging between extension and scripts living in the main window's context.
  * `solidity/`: main contract and Docker configuration to deploy it on a development chain.
2. Ads service
  * `ads_impl.cc`: added simple sorting algorithms and a hacky routine to enrich the bundle with price data.
  * `rpc-ranker/`: new component interfacing with Ethereum on `localhost:8545`.

![alt text](https://github.com/ma9o/brave-core/blob/master/vendor/rpc-ranker/graph.png "Dataflow")

**Compilation not tested yet!**
