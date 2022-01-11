// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";
import "hardhat/console.sol";

contract BnomialNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(address => uint256[]) private _badges;

    constructor() ERC721("Bnomial Achievement Badge", "BNOMIAL") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmacF9yRXkUEUHvJuCCC77JhzSLMWWJ8vFciTeVfzEoByf/";
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function mint(address to) external {
        require(balanceOf(to) == 0, "Only one token per wallet allowed");
        require(_badges[to].length > 0, "At least one achievement is needed");
        require(
            msg.sender == owner() || msg.sender == to,
            "Only contract's owner or token's owner are allowed to mint"
        );
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());
    }

    function canMint(address owner_) external view returns (bool) {
        return (_badges[owner_].length > 0);
    }

    function addBadge(address owner_, uint256 badge_) external onlyOwner {
        _badges[owner_].push(badge_);
    }

    function getBadges(address owner_) external view returns (uint256[] memory) {
        return _badges[owner_];
    }

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

    function _transfer(
        address,
        address,
        uint256
    ) internal pure override {
        revert("ERC721: token transfer disabled");
    }
}
