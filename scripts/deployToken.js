async function main() {
    const [deployer] = await ethers.getSigners()

    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())
    const BnomialTokenContract = await ethers.getContractFactory("BnomialToken")
    const BnomialTokendeployed = await BnomialTokenContract.deploy()
    console.log("BinomialTokendeployed Contract address:", BnomialTokendeployed.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
