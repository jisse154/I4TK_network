// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract I4TKdocToken is
    ERC1155,
    ERC1155URIStorage,
    AccessControl,
    ERC1155Burnable,
    ERC1155Supply
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public constant DECIMAL = 6;
    uint256 public constant tokenMaxSupply=100*1e6;

    struct Contribution {
        uint256 TokenId;
        uint256 Weight;
    }

    mapping(uint256 => Contribution[]) public contributions;
    mapping(uint256 => address) public creator;

    uint256 private _tokenIdCounter;

    constructor(address defaultAdmin) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        //_grantRole(MINTER_ROLE, minter);
    }

    function uri(
        uint256 tokenId
    ) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return ERC1155URIStorage.uri(tokenId);
    }

    function mint(
        address account,
        string memory tokenURI,
        uint256[] memory references,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _mint(account, tokenId, tokenMaxSupply, data);
        ERC1155URIStorage._setURI(tokenId, tokenURI);
        _contributionDefinition(tokenId, references);
        creator[tokenId]=tx.origin;
        _tokenIdCounter += 1;
        return tokenId;
    }

  

    function _contributionDefinition(
        uint256 _tokenId,
        uint256[] memory _references
    ) internal virtual {
        
        Contribution memory tokenIdContrib;

        if (_references.length == 0) {
            tokenIdContrib = Contribution(_tokenId, 1 * 1e6);
            contributions[_tokenId].push(tokenIdContrib);
        } else {
            tokenIdContrib = Contribution(_tokenId, 0.4 * 1e6);

            contributions[_tokenId].push(tokenIdContrib);
            

            uint256 nbOfRef = _references.length;

            for (uint256 i = 0; i < nbOfRef; i++) {
                uint256 refTokenID = _references[i];

                for (uint256 y = 0; y < contributions[refTokenID].length; y++) {
                    Contribution memory Contrib = Contribution(
                        contributions[refTokenID][y].TokenId,
                        contributions[refTokenID][y].Weight * 3 / 5 /nbOfRef
                    );
                    contributions[_tokenId].push(Contrib);
                    
                }
            }

        }
    }

    // function setURI(uint256 tokenId, string memory tokenURI) public  {
    //     ERC1155URIStorage._setURI(tokenId,tokenURI);
    // }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function formatTokenURI(
        string memory _CID,
        string memory _title,
        string memory _authors,
        string memory _description,
        string memory _programme,
        string memory _category
    ) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "I4TK document Token #',
                                _tokenIdCounter,
                                '"',
                                ',"description": "A content proposed by a member of the I4KT network community", "content": "ipfs://',
                                _CID,
                                '"',
                                ',"properties": {"title": "',
                                _title,
                                '","authors":"',
                                _authors,
                                '","description": "',
                                _description,
                                '","programme": "',
                                _programme,
                                '","category": "',
                                _category,
                                '"}}'
                            )
                        )
                    )
                )
            );
    }

    function getcontributions(uint256 tokenId, uint256 size) external view returns(uint256[2][] memory) {
        
        uint256[2][] memory _result =new uint256[2][](size);
        for( uint256 i =0; i < contributions[tokenId].length; i++) {

            //_result.push([contributions[tokenId][i].TokenId,contributions[tokenId][i].Weight]);
                _result[i][0]=contributions[tokenId][i].TokenId;
                _result[i][1]=contributions[tokenId][i].Weight;


        }

        return _result;

    }

        function getLengthContrib ( uint256 tokenId) external view returns (uint256) {
        return contributions[tokenId].length;
    }

    

}
