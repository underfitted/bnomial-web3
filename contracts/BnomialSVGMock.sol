// SPDX-License-Identifier: MIT

/**
 *   @title Bnomial SVG Renderer Mock contract
 *   @author Underfitted Social Club
 *   @notice Mock contract that exposes the internal functions from BnomialSVG for testing
 */

import "./BnomialSVG.sol";

pragma solidity ^0.8.2;

contract BnomialSVGMock {
    function addressToString(address x) external pure returns (string memory) {
        return BnomialSVG.addressToString(x);
    }

    function renderFloat(uint256 number) external pure returns (string memory text) {
        return BnomialSVG.renderFloat(number);
    }

    function getAnimationTimes(uint256 badgesCount) external pure returns (string memory times) {
        return BnomialSVG.getAnimationTimes(badgesCount);
    }

    function getAnimationOffsets(uint256 badgesCount) external pure returns (string memory offsets) {
        return BnomialSVG.getAnimationOffsets(badgesCount);
    }

    function getAnimation(uint256 badgesCount) external pure returns (string memory) {
        return BnomialSVG.getAnimation(badgesCount);
    }

    function getCard(
        uint256 badgeId,
        string memory name,
        uint256 index
    ) external pure returns (string memory) {
        return BnomialSVG.getCard(badgeId, name, index);
    }

    function renderSVG(
        address owner,
        uint256[] memory badges,
        string[] memory names
    ) external pure returns (string memory svg) {
        return BnomialSVG.renderSVG(owner, badges, names);
    }
}
