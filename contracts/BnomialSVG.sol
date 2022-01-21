// SPDX-License-Identifier: MIT

/**
 *   @title Bnomial SVG Renderer
 *   @author Underfitted Social Club
 *   @notice Library containing functions to render the SVG representation of the BnomailNFT
 */

import "@openzeppelin/contracts/utils/Strings.sol";

pragma solidity ^0.8.2;

library BnomialSVG {
    uint256 private constant CARD_OFFSET_X = 70;
    uint256 private constant CARD_TIME_DURATION = 2;
    uint256 private constant SHOW_TIME_PERCENTAGE = 95;

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
     * @notice the number should be less than 1000000 (1.0)
     * @dev Helper function to convert float stored as an uint256 with a factor of 1e6 to a string
     * @param number the number to convert
     * @return text string text representation of the float number
     */
    function renderFloat(uint256 number) internal pure returns (string memory text) {
        require(number < 1000000, "Number must be less than 1000000");

        string memory numberString = Strings.toString(number);
        text = string(abi.encodePacked(text, "0."));
        for (uint256 i = bytes(numberString).length; i < 6; i++) {
            text = string(abi.encodePacked(text, "0"));
        }
        text = string(abi.encodePacked(text, numberString));
    }

    /**
     * @dev Get the keyframe times for the card animation
     * @param badgesCount number of cards in the NFT
     * @return times string text representation of the keyframe times
     */
    function getAnimationTimes(uint256 badgesCount) internal pure returns (string memory times) {
        require(badgesCount > 0, "Badges count must be greater than 0");

        uint256 showTime = (SHOW_TIME_PERCENTAGE * 10000) / badgesCount; // Optimized version of (SHOW_TIME_PERCENTAGE * badgeTime) / 100

        for (uint256 i = 0; i < badgesCount; i++) {
            times = string(
                abi.encodePacked(
                    times,
                    renderFloat((i * 1000000) / badgesCount),
                    ";",
                    renderFloat((i * 1000000) / badgesCount + showTime),
                    ";"
                )
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
        require(badgesCount > 0, "Badges count must be greater than 0");

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
        require(badgesCount > 0, "Badges count must be greater than 0");

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
     * @param name name of the badge to display on the card
     * @param index index of the badge in the wallet's collection of badges
     * @return svg string the SVG tags representing the badge card
     */
    function getCard(
        uint256 badgeId,
        string memory name,
        uint256 index
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<g transform="translate(',
                    Strings.toString(index * CARD_OFFSET_X),
                    ',0)"><rect x="20" y="40" width="60" height="40" fill="#222222" rx="2" stroke="#ffffff" stroke-width="0.2"/><text font-weight="100" text-anchor="middle" font-size="3" y="45" x="25" fill="#ffffff" font-family="sans-serif">#',
                    Strings.toString(badgeId),
                    '</text><text text-anchor="middle" font-size="6" y="60" x="50" fill="#ffffff" font-family="sans-serif">',
                    name,
                    "</text></g>"
                )
            );
    }

    /**
     * @dev render the NFT SVG representation as a collection of cards
     * @param owner public address of the token owner
     * @param badges array containing the IDs of the badges the owner has
     * @param names names of the owner's badges
     * @return svg string the rendered SVG image
     */
    function renderSVG(
        address owner,
        uint256[] memory badges,
        string[] memory names
    ) internal pure returns (string memory svg) {
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
            svg = string(abi.encodePacked(svg, getCard(badges[i], names[i], i)));
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
}
