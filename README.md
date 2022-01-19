# bnomial-web3

Smart contracts for [bnomial](https://github.com/underfitted/bnomial).

## Repository Organization

The main artifacts (files and folders) in the repository are:

-   [contracts](contracts/): It contains smart contracts, NFTs and related utility functions for the project;
-   [scripts](scripts/): [Hardhat](https://hardhat.org/) custom scripts;
-   [test](test/): Bnomial test sets;
-   [hardhat.config.js](hardhat.config.js): Main configuration file for Hardhat. You should customize it if you want to deploy
    the contracts in remote networks.

## Setup

### Local machine \ IDE agnostic

You should have [npm](https://www.npmjs.com/) installed, so be sure to follow the proper procedure for your OS. After that, download and install all required libraries and plugins by running:

```
npm install
```

### VSCode Remote Container

You may use [VSCode Remote Container](https://code.visualstudio.com/docs/remote/containers) if you want to avoid local
installations. Just install the [extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) and setup your local Docker as described
[here](https://code.visualstudio.com/docs/remote/containers#_getting-started).

When running the project in the development container, you may use the embedded vscode terminal to execute the
_deployment workflow_.

> :warning: The container runs all processes and update the files as the internal user _node:node_ (1000:1000).

## Develop

Smart contracts and NFTs demand an account and a blockchain network to be deployed into. Besides that, it's important to set an
access provider (e.g., [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)) and a blockchain explorer
(e.g. [Polygonscan](https://polygonscan.com/) or [Etherscan](https://etherscan.io/)). Hardhat provides a built-in network to
ease local development. When deploying to remote networks, you must:

-   Set up [hardhat configuration file](hardhat.config.js) by removing the comments according to the network you want to use;
-   Create an `.env` file and set up the required information for the network (the `POLYGON_API_URL` is not needed if you are
    just testing on Mumbai). The properties are: - `MUMBAI_API_URL`: Alchemy HTTP URL - `POLYGON_API_URL`: Alchemy HTTP URL - `PRIVATE_KEY` : Deploy wallet private key - `POLYSCAN_KEY` : Polygonscan API key for verification

Here is an example of `.env`file for deploying a contract in Mumbai Net:

```
MUMBAI_API_URL="https://polygon-mumbai.g.alchemy.com/v2/ThIs0Is1NoT2a3VaLiD4aPi5KeY99999"
PRIVATE_KEY="1A2LoNg3BoRiNg4AnD5FAke6PriVATE7KEY8FOR9MumBAI10NETwork000999111"
POLYSCAN_KEY="0ANOTHER111FAKE22222KEY3333333HERE"
```

The smart contract code is in [contracts/BnomialNFT.sol](/contracts/BnomialNFT.sol).

To compile it run:

```
npm run build
```

Detailed description of Bnomial project and some guidelines regarding its set up and development is available in the [official documentation](https://docs.underfitted.io/incubator/bnomial/web3/environment-setup).

## Test

The tests for the smart contract are in [test/BnomialNFT.test.js](/test/BnomialNFT.test.js).

To run the full test suite:

```
npm run test:full
```

To create the coverage report:

```
npm run coverage
```

To run the gas price estimation:

```
npm run gas
```

## Deploy

To deploy the smart contract on the Mumbai test chain (Polygon):

```
npm run deploy:token:mumbai
```

To deploy the NFT on the Mumbai test chain (Polygon):

```
npm run deploy:nft:mumbai
```

To verify the smart contract:

```
npm run verify:mumbai -- <smart contract address>
```

## Deployed contract for testing

The current NFT contract is deployed on the Mumbai testnet here: [0x35b5147E74993fD8B77c859d5489A22BFB21e015](https://mumbai.polygonscan.com/address/0x0f4e762a781E72AEB3720E3f76F1fD2751D25F77)

The current Token contract is deployed on the Mumbai testnet here: [0xc4C99f33F686A74a2Fe95B26Ce317708f605A9eA](https://mumbai.polygonscan.com/address/0xc4C99f33F686A74a2Fe95B26Ce317708f605A9eA)

## Setup Slither-Analyzer

Slither is a Solidity static analysis framework written in Python 3. It runs to analyze code vulnerabilities according to security aspects.

Environment

```
python 3.6+
```

Create a new virtual environment:

```
python -m venv .venv
source .venv/bin/activate
```

Install the required Python packages:

```
pip install -r requirements.txt
```

To run slither-analyzer:

```
npm run slither
```
