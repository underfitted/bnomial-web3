async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const BnomialNFTContract = await ethers.getContractFactory("BnomialNFT");
    const NFTcontract = await BnomialNFTContract.deploy();
    console.log("NFTcontract Contract address:", NFTcontract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
