// This script can be used to render the SVG from the contract and store it in a file in order to enable faster testing.

fs = require("fs")

async function main() {
    const svgMockContractFactory = await ethers.getContractFactory("BnomialSVGMock")
    const svgMockContract = await svgMockContractFactory.deploy()

    const svg = await svgMockContract.renderSVG(
        "0xF2DAd1bFEF508d2E0cf44D61538E6487f15cDF63",
        [1, 10, 234],
        ["10 correct ansers", "100 correct answers", "90% CV answers"]
    )
    fs.writeFileSync("nft.svg", svg)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
