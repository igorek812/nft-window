// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract MolokoNFT is ERC721URIStorage, ReentrancyGuard {

    uint public tokenIds;
    address public founder;

    struct Item {
        address payable owner;
        uint256 tokenId;
        uint256 price;
        string tokenURI;
    }

    mapping(uint256 => Item) private idToItem;

    constructor() ERC721 ("MolokoNFT", "MNFT") {
        founder = msg.sender;
    }

    modifier onlyFounder {
        require(msg.sender == founder, 'Only founder');
        _;
    }

    // 1 создание нфт
    function mint(string memory tokenURI, uint256 price) public onlyFounder {
        require(price > 0, "Price must be at least 1 wei");

        uint256 newItemId = tokenIds;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenIds++;

        idToItem[newItemId] =  Item(
            payable(msg.sender),
            newItemId,
            price,
            tokenURI
        );
    }

    // 2 изменить нфт uri (в случае дропа сервера с картинками)
    function updateTokenURI(uint256 tokenId, string memory newTokenURI) public onlyFounder {
        _setTokenURI(tokenId, newTokenURI);
    }

    // 3 получить все нфт
    function fetchItems() public view returns (Item[] memory) {
        uint itemCount = tokenIds;

        Item[] memory items = new Item[](itemCount);

        for (uint i = 0; i < itemCount; i++) {
            items[i] = idToItem[i];
        }

        return items;
    }

    // 4 получить конкретную нфт
    function getItem(uint256 tokenId) public view returns (Item memory) {
        require(_exists(tokenId), "Nonexistent token");
        return idToItem[tokenId];
    }

    // 5 изменить цену нфт
    function changeItemPrice(uint256 tokenId, uint newPrice) public {
        require(_exists(tokenId), "Nonexistent token");

        Item storage currentItem = idToItem[tokenId];

        require(msg.sender == currentItem.owner, 'Only owner');

        currentItem.price = newPrice;
    }

    // 6 покупка нфт
    function buyItem(uint256 tokenId) external payable nonReentrant { // nonReentrant чтобы не было повторных списаний
        require(_exists(tokenId), "Nonexistent token");

        Item storage currentItem = idToItem[tokenId];

        require(msg.value == currentItem.price, 'Incorrect payment summ');

        (bool success, ) = currentItem.owner.call{value: currentItem.price}("");
        require(success, "Transfer failed.");

        _transfer(currentItem.owner, msg.sender, tokenId);
        currentItem.owner = payable(msg.sender);
    }
}
