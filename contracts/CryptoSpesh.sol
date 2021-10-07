// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract CryptoSpesh is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    bool public hasSaleStarted = false;
    uint public constant SPESH_LIMIT = 10000;
    uint public constant SPESH_PRICE = 100000000000000000; // 0.1 ETH
    uint public donationSum = 0; // how much has been set aside/has been donated
    address payable public treasuryAddress;
    address payable public donationsAddress;

    constructor(address payable _treasuryAddress, address payable _donationsAddress) ERC721("CryptoSpesh", "CS") {
        treasuryAddress = _treasuryAddress;
        donationsAddress = _donationsAddress;
    }

    // Treat yourself!
    function buyMultipleSpesh(uint256 numSpesh) external payable {
        require(totalSupply() < SPESH_LIMIT, "We are all out of CryptoSpesh :(");
        require(numSpesh > 0 && numSpesh <= 20, "You can only buy 1 to 20 spesh at a time");
        require(totalSupply().add(numSpesh) <= SPESH_LIMIT, "There aren't enough spesh left :(");
        uint256 totalPrice = SPESH_PRICE.mul(numSpesh);
        require(msg.value >= totalPrice, "Ether value sent is below the price");

        treasuryAddress.transfer(totalPrice.mul(8).div(10)); // send to treasury account
        uint256 amountToDonate = totalPrice.mul(2).div(10);
        donationsAddress.transfer(amountToDonate); // send to donations account
        donationSum = donationSum + amountToDonate;

        for (uint i = 0; i < numSpesh; i++) {
            uint mintIndex = totalSupply();
            _safeMint(msg.sender, mintIndex);
            console.log("Spesh %s minted by address %s", mintIndex, msg.sender);
        }
    }

    // What spesh do I have?
    function listSpeshForOwner(address _owner) external view returns(uint256[] memory) {
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
