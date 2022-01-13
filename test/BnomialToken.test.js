const { BigNumber } = require("@ethersproject/bignumber")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("BnomialToken", () => {
    let contract
    let owner
    let addr1

    beforeEach(async function () {
        BnomialTokenContract = await ethers.getContractFactory("BnomialToken")
        ;[owner, addr1] = await ethers.getSigners()
        contract = await BnomialTokenContract.deploy()
    })

    it("should mint a token", async () => {
        // Start with no tokens
        expect(await contract.totalSupply()).to.equal(0)

        // Mint 10 new tokens and check
        await contract.mint(owner.address, 10)
        expect(await contract.totalSupply()).to.equal(10)

        // Mint another 100 tokens and check
        await contract.mint(addr1.address, 100)
        expect(await contract.totalSupply()).to.equal(110)
    })

    it("should allow only owner to mint a token", async () => {
        // Expect minting from another wallet to fail
        await expect(contract.connect(addr1).mint(addr1.address, 1)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
        )

        // Expect minting from owner to succeed
        await expect(contract.mint(addr1.address, 1)).to.not.be.reverted
    })

    it("should reduce balance after burn", async () => {
        // Mint 10 tokens and check balance
        await contract.mint(owner.address, 10)
        expect(await contract.balanceOf(owner.address)).to.equal(10)

        // Burn 2 tokens and check balance
        await contract.burn(2)
        expect(await contract.balanceOf(owner.address)).to.equal(8)

        // Burn remaining 0 tokens and check balance
        await contract.burn(8)
        expect(await contract.balanceOf(owner.address)).to.equal(0)
    })
})
