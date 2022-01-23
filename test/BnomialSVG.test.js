const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("BnomialSVG", () => {
    let contract

    beforeEach(async () => {
        let svgMockContractFactory = await ethers.getContractFactory("BnomialSVGMock")
        contract = await svgMockContractFactory.deploy()
    })

    it("should convert address as string", async () => {
        ;[owner] = await ethers.getSigners()
        expect(await contract.addressToString(owner.address)).to.equal(owner.address.toString().toLowerCase())
    })

    it("should render a float", async () => {
        expect(await contract.renderFloat(0)).to.equal("0.000000")
        expect(await contract.renderFloat(123)).to.equal("0.000123")
        expect(await contract.renderFloat(12345)).to.equal("0.012345")
        expect(await contract.renderFloat(123456)).to.equal("0.123456")
        await expect(contract.renderFloat(1000000)).to.be.revertedWith("Number must be less than 1000000")
        await expect(contract.renderFloat(236423423742)).to.be.revertedWith("Number must be less than 1000000")
    })

    it("should calculate animation times", async () => {
        expect(await contract.getAnimationTimes(1)).to.equal("0.000000;0.950000;1")
        expect(await contract.getAnimationTimes(2)).to.equal("0.000000;0.475000;0.500000;0.975000;1")
        expect(await contract.getAnimationTimes(3)).to.equal("0.000000;0.316666;0.333333;0.649999;0.666666;0.983332;1")

        await expect(contract.getAnimationTimes(0)).to.be.revertedWith("Badges count must be greater than 0")
    })

    it("should calculate animation offsets", async () => {
        expect(await contract.getAnimationOffsets(1)).to.equal("0 0;0 0;0 0")
        expect(await contract.getAnimationOffsets(2)).to.equal("0 0;0 0;-70 0;-70 0;0 0")
        expect(await contract.getAnimationOffsets(3)).to.equal("0 0;0 0;-70 0;-70 0;-140 0;-140 0;0 0")

        await expect(contract.getAnimationOffsets(0)).to.be.revertedWith("Badges count must be greater than 0")
    })

    it("should get animation SVG tag", async () => {
        expect(await contract.getAnimation(2)).to.equal(
            '<animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="translate" keyTimes="0.000000;0.475000;0.500000;0.975000;1" values="0 0;0 0;-70 0;-70 0;0 0"></animateTransform>'
        )

        await expect(contract.getAnimation(0)).to.be.revertedWith("Badges count must be greater than 0")
    })

    it("should get card SVG tags", async () => {
        expect(await contract.getCard(1, "test", 0)).to.equal(
            '<g transform="translate(0,0)"><rect x="20" y="40" width="60" height="40" fill="#222222" rx="2" stroke="#ffffff" stroke-width="0.2"/><text font-weight="100" text-anchor="middle" font-size="3" y="45" x="25" fill="#ffffff" font-family="sans-serif">#1</text><text text-anchor="middle" font-size="6" y="60" x="50" fill="#ffffff" font-family="sans-serif">test</text></g>'
        )
    })

    it("should render SVG", async () => {
        expect(await contract.renderSVG("0xF2DAd1bFEF508d2E0cf44D61538E6487f15cDF63", [1], ["test"])).to.equal(
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.2" preserveAspectRatio="xMinYMin meet" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" fill="#000000"/><g><text font-weight="bold" text-anchor="middle" font-size="15" y="15" x="50" fill="#ffffff" font-family="sans-serif">BNOMIAL</text><text font-weight="100" text-anchor="middle" font-size="4" y="23" x="50" fill="#ffffff" font-family="sans-serif">ACHIEVEMENTS BADGE</text><text font-weight="100" text-anchor="middle" font-size="2" y="29" x="50" fill="#aaaaaa" font-family="sans-serif">0xf2dad1bfef508d2e0cf44d61538e6487f15cdf63</text></g><g><g transform="translate(0,0)"><rect x="20" y="40" width="60" height="40" fill="#222222" rx="2" stroke="#ffffff" stroke-width="0.2"/><text font-weight="100" text-anchor="middle" font-size="3" y="45" x="25" fill="#ffffff" font-family="sans-serif">#1</text><text text-anchor="middle" font-size="6" y="60" x="50" fill="#ffffff" font-family="sans-serif">test</text></g><animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="translate" keyTimes="0.000000;0.950000;1" values="0 0;0 0;0 0"></animateTransform></g><g><text font-weight="100" text-anchor="middle" font-size="2.5" y="93" x="50" fill="#ffffff" font-family="sans-serif">BADGES COUNT ⋅ 1</text></g></svg>'
        )
    })
})
