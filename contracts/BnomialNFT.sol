// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Base64.sol";

contract BnomialNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(address => uint256) private _levels;

    constructor() ERC721("Bnomial Achievement Badge", "BNOMIAL") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmUE45oBmtMweg6skYBj21navRCgPs29q6p9oSmeYMAUqt/";
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

        address owner = ownerOf(tokenId);
        uint256 level = _levels[owner];

        string memory part0 = '{"name":"Bnomial Badges",';
        string
            memory part1 = '"description":"This NFT represents an on-chain proof of the owners achievements on Bnomial",';
        string memory part2 = '"image":"';
        string memory part3 = _baseURI();
        string memory part4 = 'nft.png",';
        string memory part5 = '"animation_url":"';
        string memory part6 = _baseURI();
        string memory part7 = "nft.html?level=";
        string memory part8 = Strings.toString(level);
        string memory part9 = '"}';

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        part0,
                        part1,
                        part2,
                        part3,
                        part4,
                        part5,
                        part6,
                        part7,
                        part8,
                        part9
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
    
    function _transfer(address from, address to, uint256 tokenId) internal pure override {
      require(!true, "ERC721: token transfer disabled");
    }
}
