async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const BinomialToken1Contract = await ethers.getContractFactory("BinomialToken1");
    const BinomialToken1deployed = await BinomialToken1Contract.deploy();
    console.log("BinomialTokendeployed Contract address:", BinomialToken1deployed.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
