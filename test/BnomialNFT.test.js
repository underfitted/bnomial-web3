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

    it("should return a JSON metadata", async () => {
        const expectedMetadata =
            "data:application/json;base64,eyJuYW1lIjoiQm5vbWlhbCBCYWRnZXMiLCJkZXNjcmlwdGlvbiI6IlRoaXMgTkZUIHJlcHJlc2VudHMgYW4gb24tY2hhaW4gcHJvb2Ygb2YgdGhlIG93bmVycyBhY2hpZXZlbWVudHMgb24gQm5vbWlhbCIsImF0dHJpYnV0ZXMiOiBbXSwiaW1hZ2UiOiJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSFpsY25OcGIyNDlJakV1TWlJZ2RtbGxkMEp2ZUQwaU1DQXdJREV3TUNBeE1EQWlQanh5WldOMElIZzlJakFpSUhrOUlqQWlJSGRwWkhSb1BTSXhNREFpSUdobGFXZG9kRDBpTVRBd0lpQm1hV3hzUFNJak1EQXdNREF3SWk4K1BHYytQSFJsZUhRZ1ptOXVkQzEzWldsbmFIUTlJbUp2YkdRaUlIUmxlSFF0WVc1amFHOXlQU0p0YVdSa2JHVWlJR1p2Ym5RdGMybDZaVDBpTVRVaUlIazlJakUxSWlCNFBTSTFNQ0lnWm1sc2JEMGlJMlptWm1abVppSWdabTl1ZEMxbVlXMXBiSGs5SW5OaGJuTXRjMlZ5YVdZaVBrSk9UMDFKUVV3OEwzUmxlSFErUEhSbGVIUWdabTl1ZEMxM1pXbG5hSFE5SWpFd01DSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0lnWm05dWRDMXphWHBsUFNJMElpQjVQU0l5TXlJZ2VEMGlOVEFpSUdacGJHdzlJaU5tWm1abVptWWlJR1p2Ym5RdFptRnRhV3g1UFNKellXNXpMWE5sY21sbUlqNUJRMGhKUlZaRlRVVk9WRk1nUWtGRVIwVThMM1JsZUhRK1BIUmxlSFFnWm05dWRDMTNaV2xuYUhROUlqRXdNQ0lnZEdWNGRDMWhibU5vYjNJOUltMXBaR1JzWlNJZ1ptOXVkQzF6YVhwbFBTSXlJaUI1UFNJeU9TSWdlRDBpTlRBaUlHWnBiR3c5SWlOaFlXRmhZV0VpSUdadmJuUXRabUZ0YVd4NVBTSnpZVzV6TFhObGNtbG1JajR3ZURjd09UazNPVGN3WXpVeE9ERXlaR016WVRBeE1HTTNaREF4WWpVd1pUQmtNVGRrWXpjNVl6ZzhMM1JsZUhRK1BDOW5QanhuUGp4bklIUnlZVzV6Wm05eWJUMGlkSEpoYm5Oc1lYUmxLREFzTUNraVBqeHlaV04wSUhnOUlqSXdJaUI1UFNJME1DSWdkMmxrZEdnOUlqWXdJaUJvWldsbmFIUTlJalF3SWlCbWFXeHNQU0lqTWpJeU1qSXlJaUJ5ZUQwaU1pSWdjM1J5YjJ0bFBTSWpabVptWm1abUlpQnpkSEp2YTJVdGQybGtkR2c5SWpBdU1pSXZQangwWlhoMElHWnZiblF0ZDJWcFoyaDBQU0l4TURBaUlIUmxlSFF0WVc1amFHOXlQU0p0YVdSa2JHVWlJR1p2Ym5RdGMybDZaVDBpTXlJZ2VUMGlORFVpSUhnOUlqSTFJaUJtYVd4c1BTSWpabVptWm1abUlpQm1iMjUwTFdaaGJXbHNlVDBpYzJGdWN5MXpaWEpwWmlJK0l6SThMM1JsZUhRK1BIUmxlSFFnZEdWNGRDMWhibU5vYjNJOUltMXBaR1JzWlNJZ1ptOXVkQzF6YVhwbFBTSTJJaUI1UFNJMk1DSWdlRDBpTlRBaUlHWnBiR3c5SWlObVptWm1abVlpSUdadmJuUXRabUZ0YVd4NVBTSnpZVzV6TFhObGNtbG1JajQ4TDNSbGVIUStQQzluUGp4bklIUnlZVzV6Wm05eWJUMGlkSEpoYm5Oc1lYUmxLRGN3TERBcElqNDhjbVZqZENCNFBTSXlNQ0lnZVQwaU5EQWlJSGRwWkhSb1BTSTJNQ0lnYUdWcFoyaDBQU0kwTUNJZ1ptbHNiRDBpSXpJeU1qSXlNaUlnY25nOUlqSWlJSE4wY205clpUMGlJMlptWm1abVppSWdjM1J5YjJ0bExYZHBaSFJvUFNJd0xqSWlMejQ4ZEdWNGRDQm1iMjUwTFhkbGFXZG9kRDBpTVRBd0lpQjBaWGgwTFdGdVkyaHZjajBpYldsa1pHeGxJaUJtYjI1MExYTnBlbVU5SWpNaUlIazlJalExSWlCNFBTSXlOU0lnWm1sc2JEMGlJMlptWm1abVppSWdabTl1ZEMxbVlXMXBiSGs5SW5OaGJuTXRjMlZ5YVdZaVBpTXlNRHd2ZEdWNGRENDhkR1Y0ZENCMFpYaDBMV0Z1WTJodmNqMGliV2xrWkd4bElpQm1iMjUwTFhOcGVtVTlJallpSUhrOUlqWXdJaUI0UFNJMU1DSWdabWxzYkQwaUkyWm1abVptWmlJZ1ptOXVkQzFtWVcxcGJIazlJbk5oYm5NdGMyVnlhV1lpUGp3dmRHVjRkRDQ4TDJjK1BHRnVhVzFoZEdWVWNtRnVjMlp2Y20wZ1lYUjBjbWxpZFhSbFRtRnRaVDBpZEhKaGJuTm1iM0p0SWlCa2RYSTlJalJ6SWlCaVpXZHBiajBpTUhNaUlISmxjR1ZoZEVOdmRXNTBQU0pwYm1SbFptbHVhWFJsSWlCMGVYQmxQU0owY21GdWMyeGhkR1VpSUd0bGVWUnBiV1Z6UFNJd0xqQXdNREF3TURzd0xqUTNOVEF3TURzd0xqVXdNREF3TURzd0xqazNOVEF3TURzeElpQjJZV3gxWlhNOUlqQWdNRHN3SURBN0xUY3dJREE3TFRjd0lEQTdNQ0F3SWlCallXeGpUVzlrWlQwaWMzQnNhVzVsSWo0OEwyRnVhVzFoZEdWVWNtRnVjMlp2Y20wK1BDOW5QanhuUGp4MFpYaDBJR1p2Ym5RdGQyVnBaMmgwUFNJeE1EQWlJSFJsZUhRdFlXNWphRzl5UFNKdGFXUmtiR1VpSUdadmJuUXRjMmw2WlQwaU1pNDFJaUI1UFNJNU15SWdlRDBpTlRBaUlHWnBiR3c5SWlObVptWm1abVlpSUdadmJuUXRabUZ0YVd4NVBTSnpZVzV6TFhObGNtbG1JajVDUVVSSFJWTWdRMDlWVGxRZzRvdUZJREk4TDNSbGVIUStQQzluUGp3dmMzWm5QZz09In0="

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
