const { BigNumber } = require("@ethersproject/bignumber")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("BnomialNFT", () => {
    let contract
    let owner
    let addr1
    let addr2

    beforeEach(async function () {
        BnomialNFTContract = await ethers.getContractFactory("BnomialNFT")
        ;[owner, addr1, addr2] = await ethers.getSigners()

        contract = await BnomialNFTContract.deploy()
    })

    it("should mint the NFT only after achieve a badge. (Badge's owner)", async () => {
        // Add a badge
        await contract.addBadge(addr1.address, 1)
        // Mint the NFT
        await contract.connect(addr1).mint(addr1.address)

        expect(await contract.totalSupply()).to.equal(1)
        expect(await contract.balanceOf(addr1.address)).to.equal(1)
        expect(await contract.ownerOf(1)).to.equal(addr1.address)
    })

    it("should mint the NFT only after achieve a badge. (Contract's owner)", async () => {
        // Add a badge
        await contract.addBadge(addr1.address, 1)
        // Mint the NFT
        await contract.mint(addr1.address)

        expect(await contract.totalSupply()).to.equal(1)
        expect(await contract.balanceOf(addr1.address)).to.equal(1)
        expect(await contract.ownerOf(1)).to.equal(addr1.address)
    })

    it("should fail to mint due to the owner's wallet doesn't have a badge", async () => {
        // Minting a token for the owner's wallet should fail
        // due to doesn't have a badge
        await expect(contract.mint(addr1.address)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'At least one achievement is needed'"
        )
    })

    it("should fail to mint due to the address wallet isn't the badge's owner or contract's owner", async () => {
        // Add a badge
        await contract.addBadge(addr1.address, 1)
        await expect(contract.connect(addr2).mint(addr1.address)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Only contract's owner or token's owner are allowed to mint'"
        )
    })

    it("should start counting tokens from 1", async () => {
        // Add a badge
        await contract.addBadge(addr1.address, 1)
        // Mint a badge
        await contract.mint(addr1.address)

        // Expect getting the owner of token 0 to fail
        await expect(contract.ownerOf(0)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'ERC721: owner query for nonexistent token'"
        )

        // Expect getting the owner of token 1 to not fail
        await expect(contract.ownerOf(1)).to.not.be.reverted
    })

    it("should get badges", async () => {
        // Get the badges for unassigned wallet
        expect(await contract.getBadges(addr1.address)).to.deep.equal([])
    })

    it("should add badge", async () => {
        // Add a new badge
        await contract.addBadge(addr1.address, 1)

        // Mint a badge
        await contract.mint(addr1.address)

        // Expect the badges to contain only 1
        expect(await contract.getBadges(addr1.address)).to.deep.equal([BigNumber.from(1)])

        // Add a new badge
        await contract.addBadge(addr1.address, 2)

        // Expect the badges to be [1, 2]
        expect(await contract.getBadges(addr1.address)).to.deep.equal([BigNumber.from(1), BigNumber.from(2)])
    })

    it("should add badge for a wallet that has no badges", async () => {
        // Expect the badges to be empty
        expect(await contract.getBadges(addr1.address)).to.deep.equal([])

        // Add a badge
        await contract.addBadge(addr1.address, 1)

        // Expect the badges to be [1]
        expect(await contract.getBadges(addr1.address)).to.deep.equal([BigNumber.from(1)])
    })

    it("should allow only owner to add badges", async () => {
        // Expect minting from another wallet to fail
        await expect(contract.connect(addr1).addBadge(addr1.address, 1)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
        )

        // Expect minting from owner to succeed
        await contract.addBadge(addr1.address, 1)
    })

    it("should return a JSON metadata", async () => {
        const metadataJson =
            '{"name":"Bnomial Badges","description":"This NFT represents an on-chain proof of the owners achievements on Bnomial","image":"ipfs://QmacF9yRXkUEUHvJuCCC77JhzSLMWWJ8vFciTeVfzEoByf/nft.png","animation_url":"ipfs://QmacF9yRXkUEUHvJuCCC77JhzSLMWWJ8vFciTeVfzEoByf/nft.html?badges=2,20,"}'
        const expectedMetadata = "data:application/json;base64," + Buffer.from(metadataJson).toString("base64")

        // Mint a badge and add another one
        await contract.addBadge(addr1.address, 2)
        await contract.mint(addr1.address)
        await contract.addBadge(addr1.address, 20)

        // Expect the returned metadata to be correct
        expect(await contract.tokenURI(1)).to.equal(expectedMetadata)
    })

    it("should throw an exception for getting the metadata of a non-existing token", async () => {
        await expect(contract.tokenURI(1)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'ERC721Metadata: URI query for nonexistent token'"
        )
    })

    it("should allow only one token per non-owner wallet", async () => {
        // Minting one badge should work
        await contract.addBadge(addr1.address, 2)
        await contract.mint(addr1.address)

        // Minting another tokenfor the same wallet should fail
        await expect(contract.mint(addr1.address)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Only one token per wallet allowed'"
        )
    })

    it("should block nft transfer", async () => {
        // Minting one badge for owner wallet
        await contract.addBadge(owner.address, 1)
        await contract.mint(owner.address)

        // transfer nft from owner wallet should fail
        await expect(contract.transferFrom(owner.address, addr1.address, 1)).to.be.revertedWith(
            "ERC721: token transfer disabled"
        )
    })

    it("should returns false when the wallet doesn't have a badge", async () => {
        expect(await contract.canMint(addr1.address)).to.equal(false)
    })

    it("should returns true when the wallet has a badge", async () => {
        await contract.addBadge(addr1.address, 1)
        expect(await contract.canMint(addr1.address)).to.equal(true)
    })

    it("should burn the nft", async () => {
        // Minting one badge for owner wallet
        balance_before_mint = await contract.balanceOf(owner.address)
        await contract.addBadge(owner.address, 1);
        await contract.mint(owner.address);
        await contract.burn(1);
        balance_after_burn = await contract.balanceOf(owner.address)

        // minted nft should be buned by now so balance before == balance after burn
        expect(balance_before_mint).to.equal(balance_after_burn);
    });
})
