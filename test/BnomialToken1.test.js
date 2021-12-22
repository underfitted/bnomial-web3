const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("BinomialToken1", () => {
    let INITIAL_SUPPLY =  BigNumber.from(0);
    const NAME = "Underfitted Binomial Token";
    const SYMBOL = "BNT";
    
    let contract;
    let owner;
    let addr1;

    beforeEach(async function () {
        BinomialToken1Contract = await ethers.getContractFactory("BinomialToken1");
        [owner, addr1] = await ethers.getSigners();     
        contract = await BinomialToken1Contract.deploy();
    });

    it('has a name', async function () {
        console.log(contract.name())
        expect(await contract.name()).to.be.equal(NAME);
    });
    
    it('has a symbol', async function () {
    expect(await contract.symbol()).to.be.equal(SYMBOL);
    });

    it('assigns the initial total supply to the creator', async function () {
    balance_owner = await contract.balanceOf(owner.address);    
    expect(balance_owner).to.equal(INITIAL_SUPPLY.toNumber());
    });

    it("should mint a token", async () => {     
        await contract.mint(addr1.address, 1);
        total_supply = await contract.totalSupply();
        initial_supply = ( INITIAL_SUPPLY.toNumber())+1;        
        expect(total_supply).to.equal(initial_supply);
        expect(await contract.balanceOf(addr1.address)).to.equal(1);
     
    });

    it("should allow only owner to mint a token", async () => {
        // Expect minting from another wallet to fail
        await expect(contract.connect(addr1).mint(addr1.address, 1)).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
        );
        // Expect minting from owner to succeed
        await contract.mint(addr1.address, 1);
    });

    


});
