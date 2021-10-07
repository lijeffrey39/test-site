// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract MoodyMartian is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    bool public hasSaleStarted = false;
    uint public constant MARTIAN_LIMIT = 10000;
    uint public constant MARTIAN_PRICE = 100000000000000000; // 0.1 ETH (the price is in Wei)
    address payable public treasuryAddress;

    constructor(address payable _treasuryAddress) ERC721("MoodyMartian", "MM") {
        treasuryAddress = _treasuryAddress;
    }

    function buyMartian() external payable {
        require(totalSupply() < MARTIAN_LIMIT, "We are all out of Moody Martians :(");
        require(msg.value >= MARTIAN_PRICE, "Ether value sent is below the price");

        treasuryAddress.transfer(MARTIAN_PRICE); // send to treasury account

        uint mintIndex = totalSupply();
        _safeMint(msg.sender, mintIndex);
        console.log("Martian %s minted by address %s", mintIndex, msg.sender);
    }

    function listMartiansForOwner(address _owner) external view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 index;
            for (index = 0; index < tokenCount; index++) {
                result[index] = tokenOfOwnerByIndex(_owner, index);
            }
            return result;
        }
    }

    // OWNER ONLY

    function startSale() public onlyOwner {
        hasSaleStarted = true;
    }

    function pauseSale() public onlyOwner {
        hasSaleStarted = false;
    }
}
