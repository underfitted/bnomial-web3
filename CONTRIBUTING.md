# Contributing

This page will guide you through the process of contributing to this project. If you have further questions, please ask in our [Discord server](https://discord.gg/Fqf5uvj3NG).

## How to start?

In order to get a feeling about the whole development process, it is a good idea to first deploy the smart contracts to the Mumbai testnet yourself. Follow these steps:

1. Set up your environment according to this guide: https://docs.underfitted.io/incubator/bnomial/web3/environment-setup
2. Follow the steps from the [README](./README.md) to run the tests and deploy the smart contracts to the testnet.
3. Open the smart contract on `https://mumbai.polygonscan.com/<smart contract address>` and try interacting with it.

This will make sure that your environment is set up correctly and will give you a good feeling how to test the whole chain.

## Choosing an issue to work on

If you are new to the project it is recommended to start working on an [existing issue](https://github.com/underfitted/bnomial-web3/issues). The issues labeled with [`good first issue`](https://github.com/underfitted/bnomial-web3/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) are especially good for newcomers.

## Getting access to GitHub

In order to be able to work on the code without forking the repo, we can add you to the project team. Just ask in the [Discord server](https://discord.gg/Fqf5uvj3NG) and provide your GitHub username or email address.

## Implementation guidelines

Follow these guidelines to ensure that we always have a good quality of the codebase and that your changes can be merged quickly to `main`.

1. **Create a Pull Request for each change.** It is fine to solve an issue in a single or multiple Pull Requests. Clearly explain the changes in the description.
2. **Link the PR to the issue you are wokring on.** You can also put `Solves: #<issue number>` in the description to close the issue when the PR is merged.
3. **Code coverage should be 100%.** Make sure that all new code is covered by tests and the code coverage is 100% on all criteria (lines, branches, etc).
4. **All CI tests pass.** Make sure that all CI tests pass - you will not be allowed to merge otherwise.
5. **Document changes.** If you change some of the `npm run` commands in `package.json` or anything else in the process, make sure it is documented in the [README](./README.md).
6. **Deploy smart contract to testnet.** If you make changes to the smart contracts, deploy them to the testnet and test the functionality.
7. **Document deployed smart contract address.** If you make changes to the smart contracts, document the new address of the deplyed smart contract in the [README](./README.md#deployed-contract-for-testing)
8. **Ask for a review.** After you've done all of the above, ask for a review by adding people to the Reviewers list or asking on [Discord](https://discord.gg/Fqf5uvj3NG).
