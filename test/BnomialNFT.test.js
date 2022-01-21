const { BigNumber } = require("@ethersproject/bignumber")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("BnomialNFT", () => {
    let BnomialNFTContract
    let contract
    let owner
    let addr1
    let addr2

    beforeEach(async () => {
        BnomialNFTContract = await ethers.getContractFactory("BnomialNFT")
        ;[owner, addr1, addr2] = await ethers.getSigners()
        contract = await BnomialNFTContract.deploy()
    })

    it("should allow mint only if the address has a badge assigned", async () => {
        // Add a badge and mint
        await contract.addBadge(addr1.address, 1)
        await contract.connect(addr1).mint(addr1.address)

        // Expect mint to be successful
        expect(await contract.totalSupply()).to.equal(1)
        expect(await contract.balanceOf(addr1.address)).to.equal(1)
        expect(await contract.ownerOf(1)).to.equal(addr1.address)
    })

    it("should allow owner to mint for every address that has a badge", async () => {
        // Add a badge and mint
        await contract.addBadge(addr1.address, 1)
        await contract.mint(addr1.address)

        // Expect mint to be successful
        expect(await contract.totalSupply()).to.equal(1)
        expect(await contract.balanceOf(addr1.address)).to.equal(1)
        expect(await contract.ownerOf(1)).to.equal(addr1.address)
    })

    it("should not allow to mint when address has no badges", async () => {
        await expect(contract.mint(addr1.address)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'At least one badge is needed'"
        )
    })

    it("should not allow owner to mint to an address without a badge", async () => {
        await expect(contract.mint(addr1.address)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'At least one badge is needed'"
        )
    })

    it("should not allow another user to mint", async () => {
        // Add a badge to another wallet
        await contract.addBadge(addr1.address, 1)

        // Expect another user to not be able to mint it
        await expect(contract.connect(addr2).mint(addr1.address)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Only owner or address with a badge are allowed to mint'"
        )
    })

    it("should start counting tokens from 1", async () => {
        // Add a badge and mint
        await contract.addBadge(addr1.address, 1)
        await contract.mint(addr1.address)

        // Expect getting the owner of token 0 to fail
        await expect(contract.ownerOf(0)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'ERC721: owner query for nonexistent token'"
        )

        // Expect getting the owner of token 1 to not fail
        await expect(contract.ownerOf(1)).to.not.be.reverted
    })

    it("should add and get badges", async () => {
        // Unassign wallets should have no badges
        expect(await contract.getBadges(addr1.address)).to.deep.equal([])

        // Add a new badge and check
        await contract.addBadge(addr1.address, 1)
        expect(await contract.getBadges(addr1.address)).to.deep.equal([BigNumber.from(1)])

        // Add another badge and check
        await contract.addBadge(addr1.address, 3)
        expect(await contract.getBadges(addr1.address)).to.deep.equal([BigNumber.from(1), BigNumber.from(3)])
    })

    it("should allow only owner to add badges", async () => {
        // Expect minting from another wallet to fail
        await expect(contract.connect(addr1).addBadge(addr1.address, 1)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
        )

        // Expect minting from owner to succeed
        await contract.addBadge(addr1.address, 1)
    })

    it("should return JSON metadata", async () => {
        // Set badge names
        await contract.setBadgeName(1, "test 1")
        await contract.setBadgeName(1, "test 2")

        // Mint a badge and add another one
        await contract.addBadge(addr1.address, 1)
        await contract.mint(addr1.address)
        await contract.addBadge(addr1.address, 2)

        // Expect the returned metadata to be correct
        const encodedJson = await contract.tokenURI(1)
        const metadata = JSON.parse(Buffer.from(encodedJson.slice(29), "base64").toString())

        expect(metadata.name).to.equal("Bnomial Badges")
        expect(metadata.description).to.equal(
            "This NFT represents an on-chain proof of the owners achievements on Bnomial"
        )

        // Expect the image to be SVG
        const svg = Buffer.from(metadata.image.slice(26), "base64").toString()
        expect(svg.startsWith("<svg")).to.be.true
        expect(svg.endsWith("</svg>")).to.be.true
    })

    it("should throw an exception for getting the metadata of a non-existing token", async () => {
        await expect(contract.tokenURI(1)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'ERC721Metadata: URI query for nonexistent token'"
        )
    })

    it("should allow only one token per wallet", async () => {
        // Minting one badge should work
        await contract.addBadge(addr1.address, 2)
        await contract.mint(addr1.address)

        // Minting another tokenfor the same wallet should fail
        await expect(contract.mint(addr1.address)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Only one token per wallet allowed'"
        )
    })

    it("should block transfers", async () => {
        // Minting one badge for owner wallet
        await contract.addBadge(owner.address, 1)
        await contract.mint(owner.address)

        // Transfer token to another wallet should fail
        await expect(contract.transferFrom(owner.address, addr1.address, 1)).to.be.revertedWith(
            "ERC721: token transfer disabled"
        )
    })

    it("should not allow mint when the wallet doesn't have a badge", async () => {
        expect(await contract.isMintAllowed(addr1.address)).to.equal(false)
    })

    it("should allow mint when the wallet has a badge", async () => {
        await contract.addBadge(addr1.address, 1)
        expect(await contract.isMintAllowed(addr1.address)).to.equal(true)
    })

    it("should burn the nft", async () => {
        // Minting one badge for owner wallet
        balance_before_mint = await contract.balanceOf(owner.address)
        await contract.addBadge(owner.address, 1)
        await contract.mint(owner.address)
        await contract.burn(1)
        balance_after_burn = await contract.balanceOf(owner.address)

        // minted nft should be buned by now so balance before == balance after burn
        expect(balance_before_mint).to.equal(balance_after_burn)
    })

    it("should get and set the name of a badge", async () => {
        // Get the name of an unnamed badge
        expect(await contract.getBadgeName(1)).to.equal("")

        // Set the name of the badge
        await contract.setBadgeName(1, "Test badge")

        // Get the name of the badge again
        expect(await contract.getBadgeName(1)).to.equal("Test badge")
    })
})
