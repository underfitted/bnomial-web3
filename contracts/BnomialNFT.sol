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
import "./BnomialSVG.sol";

contract BnomialNFT is ERC721, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    mapping(address => uint256[]) private _badges;
    mapping(uint256 => string) private _badgeNames;

    /**
     * @dev Default constructor
     */
    constructor() ERC721("Bnomial Achievement Badge", "BNOMIAL") {}

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

    /**
     * @notice the name of a badge is displayed on the NFT image
     * @dev Get the name associated to a badge ID
     * @param badgeId ID of the badge
     * @return string name of the badge that will be displayed on the NFT
     */
    function getBadgeName(uint256 badgeId) external view returns (string memory) {
        return _badgeNames[badgeId];
    }

    /**
     * @notice the name of a badge is displayed on the NFT image
     * @dev Set the name of a badge ID
     * @param badgeId ID of the badge
     * @param badgeName the name to be associated to the badge
     */
    function setBadgeName(uint256 badgeId, string memory badgeName) external {
        _badgeNames[badgeId] = badgeName;
    }

    /**
     * @notice The token URI is a base64 encoded JSON object containing an SVG imagesrepresenting the badges owned by the token owner
     * @dev Returns token URI
     * @param tokenId the ID of the token for which the URI should be retrieved
     * @return string the token URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        // Preparte the badges data
        address badgeOwner = ownerOf(tokenId);
        uint256[] memory badges = _badges[badgeOwner];
        string[] memory names = new string[](badges.length);
        for (uint256 i = 0; i < badges.length; i++) {
            names[i] = _badgeNames[badges[i]];
        }

        // Render the SVG
        string memory svg = BnomialSVG.renderSVG(badgeOwner, badges, names);

        // Build the metadata
        string memory jsonData = string(
            abi.encodePacked(
                '{"name":"Bnomial Badges",',
                '"description":"This NFT represents an on-chain proof of the owners achievements on Bnomial",',
                '"attributes": [],',
                '"image":"data:image/svg+xml;base64,',
                Base64.encode(bytes(svg)),
                '"}'
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(jsonData))));
    }
}
