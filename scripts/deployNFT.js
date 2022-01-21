async function getContractAddress(contract) {}

async function main() {
    // Prepare the deployment
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)
    console.log("Account balance:", (await deployer.getBalance()).toString())

    // Deploy the contract
    const nftContractFactory = await ethers.getContractFactory("BnomialNFT")
    const nftContract = await nftContractFactory.deploy()

    // Currently there is a problem when using the Mumbai testnet and the address returned by the contract is wrong so we need to use a workaround.
    const txHash = nftContract.deployTransaction.hash
    console.log(`Tx hash: ${txHash}\nWaiting for transaction to be mined...`)
    const txReceipt = await ethers.provider.waitForTransaction(txHash)
    console.log("NFT contract address:", txReceipt.contractAddress)
    // console.log("NFT contract address:", BnomialTokendeployed.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
