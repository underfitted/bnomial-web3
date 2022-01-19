// SPDX-License-Identifier: MIT

/**
 *   @title Bnomial Badge NFT
 *   @author Underfitted Social Club
 *   @notice ERC721 smart contract for a dynamic NFT showing the owners on-chain badges
 */

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "./Base64.sol";

contract BnomialNFT is ERC721, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;

    string public baseURI = "ipfs://QmacF9yRXkUEUHvJuCCC77JhzSLMWWJ8vFciTeVfzEoByf/";
    Counters.Counter private _tokenIdCounter;
    mapping(address => uint256[]) private _badges;

    /**
     * @dev Default constructor
     */
    constructor() ERC721("Bnomial Achievement Badge", "BNOMIAL") {}

    /**
     * @dev Get the base URI for the tokens
     * @return string representing the base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Set the base URI for the tokens
     * @param uri new base URI
     */
    function setBaseURI(string memory uri) external onlyOwner {
        baseURI = uri;
    }

    /**
     * @dev Returns the total number of tokens minted
     * @return uint256 with total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @notice For the minting to succeed, the to address must already have at least one badge assigned
     * @notice Only one token per wallet is allowed
     * @dev Mint a new token to the specified address
     * @param to address that should receive the token
     */
    function mint(address to) external {
        require(balanceOf(to) == 0, "Only one token per wallet allowed");
        require(_badges[to].length > 0, "At least one badge is needed");
        require(msg.sender == owner() || msg.sender == to, "Only owner or address with a badge are allowed to mint");

        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());
    }

    /**
     * @notice this function checks if the to address has any badges assigned
     * @dev checks if an address is allowed to mint a token
     * @param to address to check the balance of
     * @return bool if the addess is allowed to mint or not
     */
    function isMintAllowed(address to) external view returns (bool) {
        return (_badges[to].length > 0);
    }

    /**
     * @notice only the contract owner is allowed to assign badges
     * @dev Add a badge to the specified address
     * @param to address to receive the badge
     * @param badge the badge ID that should be assigned
     */
    function addBadge(address to, uint256 badge) external onlyOwner {
        _badges[to].push(badge);
    }

    /**
     * @dev Returns the badge IDs of the to address
     * @param to address to retrieve the badges for
     * @return uint256[] list of the badge IDs assigned to the specified address
     */
    function getBadges(address to) external view returns (uint256[] memory) {
        return _badges[to];
    }

    /**
     * @notice The token URI is a base64 encoded JSON object pointing to an HTML page and specifying the badges owned by the token owner
     * @dev Returns token URI
     * @param tokenId the ID of the token for which the URI should be retrieved
     * @return string the token URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        address owner_ = ownerOf(tokenId);
        uint256[] memory badges = _badges[owner_];

        string memory badgesString = "";
        for (uint256 i = 0; i < badges.length; i++) {
            badgesString = string(abi.encodePacked(badgesString, Strings.toString(badges[i]), ","));
        }

        string memory part0 = '{"name":"Bnomial Badges",';
        string
            memory part1 = '"description":"This NFT represents an on-chain proof of the owners achievements on Bnomial",';
        string memory part2 = '"image":"';
        string memory part3 = _baseURI();
        string memory part4 = 'nft.png",';
        string memory part5 = '"animation_url":"';
        string memory part6 = _baseURI();
        string memory part7 = "nft.html?badges=";
        string memory part8 = badgesString;
        string memory part9 = '"}';

        string memory json = Base64.encode(
            bytes(string(abi.encodePacked(part0, part1, part2, part3, part4, part5, part6, part7, part8, part9)))
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /**
     * @notice All transfer transactions are reverted, because the badge NFTs should not be transferable
     * @dev Transfer a token to another address
     */
    function _transfer(
        address,
        address,
        uint256
    ) internal pure override {
        revert("ERC721: token transfer disabled");
    }
}
