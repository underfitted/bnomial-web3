# bnomial-web3

Smart contracts for [bnomial](https://github.com/underfitted/bnomial).

## Setup

To setup your environment:

```
npm install
```

To setup your API keys and private keys create an `.env` file with the following content (the `POLYGON_API_URL` is not needed if you are just testing on Mumbai).

```
MUMBAI_API_URL="<Alachemy HTTP URL>"
POLYGON_API_URL="<Alachemy HTTP URL>"
PRIVATE_KEY="<deploy wallet private key>"
POLYSCAN_KEY="<Ploygonscan API key for verification>"
```

## Develop

The smart contract code is in [contracts/BnomialNFT.sol](/contracts/BnomialNFT.sol).

To compile it run:

```
npm run build
```

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

