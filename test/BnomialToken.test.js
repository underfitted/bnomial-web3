const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("BnomialToken", () => {
    let INITIAL_SUPPLY =  BigNumber.from(0);
    const NAME = "Bnomial Token";
    const SYMBOL = "BNO";
    
    let contract;
    let owner;
    let addr1;

    beforeEach(async function () {
        BnomialTokenContract = await ethers.getContractFactory("BnomialToken");
        [owner, addr1] = await ethers.getSigners();     
        contract = await BnomialTokenContract.deploy();
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

   
    it("should pause the contract", async () => {
        // Pause the minting
        await contract.connect(owner).pause();        

        // await expect( await contract.mint(addr1.address, 1) ).to.be.reverted;
        // Expect minting to fail
        await expect(  contract.mint(addr1.address, 1) ).to.be.revertedWith(
            "VM Exception while processing transaction: reverted with reason string 'Pausable: paused'"
        );
    });

    it("should unpause the contract", async () => {
        // Pause and unpause the contract
        await contract.connect(owner).pause();
        await contract.connect(owner).unpause();

        // Minting should work
        await contract.mint(addr1.address, 1);
        expect(await contract.paused()).to.equal(false);
    });

    it("should reduce balance after burn", async () => {
        // Pause and unpause the contract
        balance_before_mint = await contract.balanceOf(owner.address)
        
        // console.log('balance_before_mint ' + JSON.stringify(balance_before_mint.toNumber()))
        await contract.mint(owner.address, 1);
        balance_after_mint = await contract.balanceOf(owner.address)
        // console.log('balance_after_mint: ' + JSON.stringify(balance_after_mint.toNumber()))

        await contract.burn( 1);
        balance_after_burn = await contract.balanceOf(owner.address)
        // console.log('balance_after_burn: ' + JSON.stringify(balance_after_burn.toNumber()))
        expect(balance_before_mint).to.equal(balance_after_burn);
        
    });

    


});
