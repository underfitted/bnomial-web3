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
    mapping(uint256 => string) private _badgeNames;

    uint256 private constant CARD_OFFSET_X = 70;
    uint256 private constant CARD_TIME_DURATION = 2;
    uint256 private constant SHOW_TIME_PERCENTAGE = 95;

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
     * @param name the name to be associated to the badge
     */
    function setBadgeName(uint256 badgeId, string memory name) external {
        _badgeNames[badgeId] = name;
    }

    /**
     * @dev Helper function to convert a wallet address to a hex string
     * @param x address to convert
     * @return string hex string representation of the address
     */
    function addressToString(address x) internal pure returns (string memory) {
        return Strings.toHexString(uint256(uint160(x)), 20);
    }

    /**
     * @notice this function is only needed to create the keyframe times for the card animation
     * @dev Helper function to convert float stored as an uint256 with a factor of 1e6 to a string
     * @param number the number to convert
     * @return text string text representation of the float number
     */
    function renderFloat(uint256 number) internal pure returns (string memory text) {
        if (number == 1000000) {
            text = string(abi.encodePacked(text, "1"));
        } else {
            string memory numberString = Strings.toString(number);
            text = string(abi.encodePacked(text, "0."));
            for (uint256 i = bytes(numberString).length; i < 6; i++) {
                text = string(abi.encodePacked(text, "0"));
            }
            text = string(abi.encodePacked(text, numberString));
        }
    }

    /**
     * @dev Get the keyframe times for the card animation
     * @param badgesCount number of cards in the NFT
     * @return times string text representation of the keyframe times
     */
    function getAnimationTimes(uint256 badgesCount) internal pure returns (string memory times) {
        uint256 badgeTime = 1000000 / badgesCount;
        uint256 showTime = (SHOW_TIME_PERCENTAGE * badgeTime) / 100;

        for (uint256 i = 0; i < badgesCount; i++) {
            times = string(
                abi.encodePacked(times, renderFloat(i * badgeTime), ";", renderFloat(i * badgeTime + showTime), ";")
            );
        }

        times = string(abi.encodePacked(times, "1"));
    }

    /**
     * @dev Get the keyframe translation offsets for the card animation
     * @param badgesCount number of cards in the NFT
     * @return offsets string text representation of the keyframe offsets
     */
    function getAnimationOffsets(uint256 badgesCount) internal pure returns (string memory offsets) {
        offsets = string(abi.encodePacked(offsets, "0 0;0 0;"));

        for (uint256 i = 1; i < badgesCount; i++) {
            offsets = string(
                abi.encodePacked(
                    offsets,
                    "-",
                    Strings.toString(i * CARD_OFFSET_X),
                    " 0;-",
                    Strings.toString(i * CARD_OFFSET_X),
                    " 0;"
                )
            );
        }

        offsets = string(abi.encodePacked(offsets, "0 0"));
    }

    /**
     * @dev Get the card animation SVG tag
     * @param badgesCount number of cards in the NFT
     * @return string the SVG <animateTransform> tag
     */
    function getAnimation(uint256 badgesCount) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<animateTransform attributeName="transform" dur="',
                    Strings.toString(badgesCount * CARD_TIME_DURATION),
                    's" begin="0s" repeatCount="indefinite" type="translate" keyTimes="',
                    getAnimationTimes(badgesCount),
                    '" values="',
                    getAnimationOffsets(badgesCount),
                    '" calcMode="spline"></animateTransform>'
                )
            );
    }

    /**
     * @dev Get the card content as SVG for a single badge
     * @param badgeId ID of the badge to render
     * @param index index of the badge in the wallet's collection of badges
     * @return svg string the SVG tags representing the badge card
     */
    function getCard(uint256 badgeId, uint256 index) internal view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<g transform="translate(',
                    Strings.toString(index * CARD_OFFSET_X),
                    ',0)"><rect x="20" y="40" width="60" height="40" fill="#222222" rx="2" stroke="#ffffff" stroke-width="0.2"/><text font-weight="100" text-anchor="middle" font-size="3" y="45" x="25" fill="#ffffff" font-family="sans-serif">#',
                    Strings.toString(badgeId),
                    '</text><text text-anchor="middle" font-size="6" y="60" x="50" fill="#ffffff" font-family="sans-serif">',
                    _badgeNames[badgeId],
                    "</text></g>"
                )
            );
    }

    /**
     * @dev render the NFT SVG representation as a collection of cards
     * @param tokenId the ID of the token for which the SVG should be rendered
     * @return svg string the rendered SVG image
     */
    function renderSVG(uint256 tokenId) public view returns (string memory svg) {
        address owner = ownerOf(tokenId);
        uint256[] memory badges = _badges[owner];

        svg = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 100 100">',
                '<rect x="0" y="0" width="100" height="100" fill="#000000"/><g><text font-weight="bold" text-anchor="middle" font-size="15" y="15" x="50" fill="#ffffff" font-family="sans-serif">BNOMIAL</text><text font-weight="100" text-anchor="middle" font-size="4" y="23" x="50" fill="#ffffff" font-family="sans-serif">ACHIEVEMENTS BADGE</text><text font-weight="100" text-anchor="middle" font-size="2" y="29" x="50" fill="#aaaaaa" font-family="sans-serif">',
                addressToString(owner),
                "</text></g>",
                "<g>"
            )
        );

        for (uint256 i = 0; i < badges.length; i++) {
            svg = string(abi.encodePacked(svg, getCard(badges[i], i)));
        }

        return
            string(
                abi.encodePacked(
                    svg,
                    getAnimation(badges.length),
                    "</g>",
                    '<g><text font-weight="100" text-anchor="middle" font-size="2.5" y="93" x="50" fill="#ffffff" font-family="sans-serif">BADGES COUNT \u22c5 ',
                    Strings.toString(badges.length),
                    "</text></g>",
                    "</svg>"
                )
            );
    }

    /**
     * @notice The token URI is a base64 encoded JSON object containing an SVG imagesrepresenting the badges owned by the token owner
     * @dev Returns token URI
     * @param tokenId the ID of the token for which the URI should be retrieved
     * @return string the token URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        // Render the SVG and encode it as base64
        string memory svg = renderSVG(tokenId);

        // The padding is currently needed because of a bug in the Base64 encoding library
        if (bytes(svg).length % 3 == 0) {
            svg = string(abi.encodePacked(svg, " "));
        } else if (bytes(svg).length % 3 == 2) {
            svg = string(abi.encodePacked(svg, "  "));
        }

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
