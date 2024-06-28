// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.24;



import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract I4TKdocToken is  ERC1155, ERC1155URIStorage, AccessControl, ERC1155Burnable , ERC1155Supply {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address defaultAdmin, address minter) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
    }
    
    uint256 private _tokenIdCounter;


    struct Item {
        uint256 id;
        address creator;
        uint256 _quantity;
        string uri;

    }

    // mapping (uint256 => Item) public Items;

    // function createItem(uint256 _quantity, string memory uri) public returns (uint256) {

    //     uint256 tokenId = _tokenIdCounter;
    //     _mint(msg.sender, newItemId, _quantity, "");

    //     Items[newItemId] = Item(newItemId, msg.sender, _quantity, uri);

    //     return newItemId;
    // }

    function uri(uint256 tokenId) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
    return ERC1155URIStorage.uri(tokenId);
}

    function mint(address account, uint256 amount,string memory tokenURI, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        uint256 tokenId = _tokenIdCounter;
        _mint(account, tokenId, amount, data);
        ERC1155URIStorage._setURI(tokenId,tokenURI);
        _tokenIdCounter += 1;
    }

    // function setURI(uint256 tokenId, string memory tokenURI) public  {
    //     ERC1155URIStorage._setURI(tokenId,tokenURI);
    // }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}