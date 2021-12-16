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

    it("should mint a badge", async () => {
        // Mint a badge
        await contract.mint(addr1.address, 1);

        expect(await contract.totalSupply()).to.equal(1);
        expect(await contract.balanceOf(addr1.address)).to.equal(1);
        expect(await contract.ownerOf(1)).to.equal(addr1.address);
    });

    it("should allow only owner to mint a badge", async () => {
        // Expect minting from another wallet to fail
        await expect(contract.connect(addr1).mint(addr1.address, 1)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
        );

        // Expect minting from owner to succeed
        await contract.mint(addr1.address, 1);
    });

    it("should start counting tokens from 1", async () => {
        // Mint a badge
        await contract.mint(addr1.address, 1);

        // Expect getting the owner of token 0 to fail
        await expect(contract.ownerOf(0)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'ERC721: owner query for nonexistent token'"
        );

        // Expect getting the owner of token 1 to not fail
        await expect(contract.ownerOf(1)).to.not.be.reverted;
    });

    it("should set the badge when minting", async () => {
        // Mint a badge
        await contract.mint(addr1.address, 1);

        expect(await contract.getBadges(addr1.address)).to.deep.equal([BigNumber.from(1)]);
    });

    it("should get badges", async () => {
        // Get the badges for unassigned wallet
        expect(await contract.getBadges(addr1.address)).to.deep.equal([]);
    });

    it("should add badge", async () => {
        // Mint a badge
        await contract.mint(addr1.address, 1);

        // Expect the badges to contain only 1
        expect(await contract.getBadges(addr1.address)).to.deep.equal([BigNumber.from(1)]);

        // Add a new badge
        await contract.addBadge(addr1.address, 2);

        // Expect the badges to be [1, 2]
        expect(await contract.getBadges(addr1.address)).to.deep.equal([BigNumber.from(1), BigNumber.from(2)]);
    });

    it("should add badge for a wallet that has no badges", async () => {
        // Expect the badges to be empty
        expect(await contract.getBadges(addr1.address)).to.deep.equal([]);

        // Add a badge
        await contract.addBadge(addr1.address, 1);

        // Expect the badges to be [1]
        expect(await contract.getBadges(addr1.address)).to.deep.equal([BigNumber.from(1)]);
    });

    it("should allow only owner to add badges", async () => {
        // Expect minting from another wallet to fail
        await expect(contract.connect(addr1).addBadge(addr1.address, 1)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
        );

        // Expect minting from owner to succeed
        await contract.addBadge(addr1.address, 1);
    });

    it("should return a JSON metadata", async () => {
        const metadataJson =
            '{"name":"Bnomial Badges","description":"This NFT represents an on-chain proof of the owners achievements on Bnomial","image":"ipfs://QmacF9yRXkUEUHvJuCCC77JhzSLMWWJ8vFciTeVfzEoByf/nft.png","animation_url":"ipfs://QmacF9yRXkUEUHvJuCCC77JhzSLMWWJ8vFciTeVfzEoByf/nft.html?badges=2"}';
        const expectedMetadata = "data:application/json;base64," + Buffer.from(metadataJson).toString("base64");

        // Mint a badge
        await contract.mint(addr1.address, 2);

        // Expect the returned metadata to be correct
        expect(await contract.tokenURI(1)).to.equal(expectedMetadata);
    });

    it("should throw an exception for getting the metadata of a non-existing token", async () => {
        await expect(contract.tokenURI(1)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'ERC721Metadata: URI query for nonexistent token'"
        );
    });

    it("should allow only one token per non-owner wallet", async () => {
        // Minting one badge should work
        await contract.mint(addr1.address, 2);

        // Minting another tokenfor the same wallet should fail
        await expect(contract.mint(addr1.address, 3)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Only one token per wallet allowed'"
        );
    });

    it("should block nft transfer", async () => {
        // Minting one badge for owner wallet
        await contract.mint(owner.address, 1);

        // transfer nft from owner wallet should fail
        await expect(contract.transferFrom(owner.address, addr1.address, 1)).to.be.revertedWith(
            "ERC721: token transfer disabled"
        );
    });
});
