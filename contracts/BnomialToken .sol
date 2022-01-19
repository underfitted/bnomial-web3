// SPDX-License-Identifier: MIT

/**
 *   @title Bnomial ERC20 token contract
 *   @author Underfitted Social Club
 *   @notice ERC20 smart contract for the Bnomial token. The token is inflationary since new tokens will be minted after every season.
 */

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BnomialToken is ERC20, ERC20Burnable, Ownable {
    /**
     * @dev Default constructor
     */
    constructor() ERC20("Bnomial Token", "BNO") {}

    /**
     * @notice Only the contract owner is allowed to mint new tokens
     * @dev Mint new tokens to a specified address
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        super._mint(to, amount);
    }
}
