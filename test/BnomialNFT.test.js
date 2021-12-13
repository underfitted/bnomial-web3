const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BnomialNFT", () => {
    let contract;
    let owner;
    let addr1;

    beforeEach(async function () {
        BnomialNFTContract = await ethers.getContractFactory("BnomialNFT");
        [owner, addr1] = await ethers.getSigners();

        contract = await BnomialNFTContract.deploy();
    });

    it("should have all constants set correctly", async () => {});
});
