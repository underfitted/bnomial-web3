// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BnomialNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(address => uint256) private _levels;

    constructor() ERC721("Bnomial Achievement Badge", "BNOMIAL") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmNaqB6a4bguztjSJXDDnp8C2dCzArWVjnmQcnVq1ZJwPi/";
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function mintBadge(address to, uint256 level) external onlyOwner {
        require(balanceOf(to) == 0, "Only one token per wallet allowed");

        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());
        _levels[to] = level;
    }

    function setLevel(address to, uint256 level) external onlyOwner {
        _levels[to] = level;
    }

    function getLevel(address to) public view returns (uint256) {
        return _levels[to];
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI = _baseURI();
        address owner = ownerOf(tokenId);
        uint256 level = _levels[owner];

        if (level == 1) {
            return string(abi.encodePacked(baseURI, "1"));
        } else if (level == 2) {
            return string(abi.encodePacked(baseURI, "2"));
        } else if (level == 3) {
            return string(abi.encodePacked(baseURI, "3"));
        } else {
            return "";
        }
    }
}
