async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const BnomialNFTContract = await ethers.getContractFactory("BnomialNFT");
    const NFTcontract = await BnomialNFTContract.deploy();
    console.log("NFTcontract Contract address:", NFTcontract.address);

    const BinomialToken1Contract = await ethers.getContractFactory("BinomialToken1");
    const BinomialToken1deployed = await BinomialToken1Contract.deploy();
    console.log("BinomialToken1deployed Contract address:", BinomialToken1deployed.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
