// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "solidity-json-writer/contracts/JsonWriter.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract I4TKdocToken is
    ERC1155,
    ERC1155URIStorage,
    AccessControl,
    ERC1155Burnable,
    ERC1155Supply
{
    using JsonWriter for JsonWriter.Json;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public constant DECIMAL = 6;
    uint256 public constant TOKEN_MAX_SUPPLY = 100 * 1e6;
    uint256 public constant CREATOR_MIN_DISTRIBUTION_RATE = 400000;

    struct Contribution {
        uint256 TokenId;
        uint256 Weight;
    }

    mapping(uint256 => Contribution[]) private _contributions;
    mapping(uint256 => uint256[]) private _tokenIdReferences;
    mapping(uint256 => address) private _creator;

    uint256 private _tokenIdCounter;
    int256 public lastTokenId = -1;

    event tokenCreation(uint256 tokenId, address creator);

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function getTokenCreator(uint256 tokenId) external view returns (address) {
        return _creator[tokenId];
    }

    function getTokenIdReferences(
        uint256 tokenId
    ) external view returns (uint256[] memory) {
        return _tokenIdReferences[tokenId];
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
        _mint(account, tokenId, TOKEN_MAX_SUPPLY, data);
        ERC1155URIStorage._setURI(tokenId, tokenURI);

        if (references.length != 0) {
            for (uint256 i = 0; i < references.length; i++) {
                _tokenIdReferences[tokenId].push(references[i]);
            }
        }

        _contributionDefinition(tokenId, references);
        _creator[tokenId] = tx.origin;
        lastTokenId = int(_tokenIdCounter);
        _tokenIdCounter += 1;

        emit tokenCreation(tokenId, tx.origin);

        return tokenId;
    }

    function _contributionDefinition(
        uint256 _tokenId,
        uint256[] memory _references
    ) internal virtual {
        Contribution memory tokenIdContrib;

        if (_references.length == 0) {
            tokenIdContrib = Contribution(_tokenId, 1 * 1e6);
            _contributions[_tokenId].push(tokenIdContrib);
        } else {
            tokenIdContrib = Contribution(
                _tokenId,
                CREATOR_MIN_DISTRIBUTION_RATE
            );

            _contributions[_tokenId].push(tokenIdContrib);

            uint256 nbOfRef = _references.length;

            for (uint256 i = 0; i < nbOfRef; i++) {
                uint256 refTokenID = _references[i];

                for (
                    uint256 y = 0;
                    y < _contributions[refTokenID].length;
                    y++
                ) {
                    Contribution memory Contrib = Contribution(
                        _contributions[refTokenID][y].TokenId,
                        (_contributions[refTokenID][y].Weight *
                            (1e6 - CREATOR_MIN_DISTRIBUTION_RATE)) /
                            1e6 /
                            nbOfRef
                    );
                    _contributions[_tokenId].push(Contrib);
                }
            }
        }
    }

    function formatTokenURI(
        uint256 tokenId,
        string memory CID,
        string memory title,
        string memory authors,
        string memory description,
        string memory programme,
        string[] memory category
    ) public pure returns (string memory) {
        string memory _name = string(
            abi.encodePacked(
                "I4TK document Token # ",
                Strings.toString(tokenId)
            )
        );
        string memory _contentURI = string(abi.encodePacked("ipfs://", CID));

        JsonWriter.Json memory writer;

        writer = writer.writeStartObject();
        writer = writer.writeStringProperty("name", _name);
        writer = writer.writeStringProperty(
            "description",
            "Token representing a content proposed by a member of the I4KT network community"
        );
        writer = writer.writeStringProperty("contentURI", _contentURI);
        writer = writer.writeStartObject("properties");
        writer = writer.writeStringProperty("title", title);
        writer = writer.writeStringProperty("authors", authors);
        writer = writer.writeStringProperty("description", description);
        writer = writer.writeStringProperty("programme", programme);
        writer = writer.writeStartArray("category");
        for (uint i = 0; i < category.length; i++) {
            writer = writer.writeStringValue(category[i]);
        }
        writer = writer.writeEndArray();
        writer = writer.writeEndObject();
        writer = writer.writeEndObject();

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(abi.encodePacked(writer.value)))
                )
            );
    }

    function getcontributions(
        uint256 tokenId
    ) external view returns (uint256[2][] memory) {
        uint256 size = _contributions[tokenId].length;

        uint256[2][] memory _result = new uint256[2][](size);
        for (uint256 i = 0; i < _contributions[tokenId].length; i++) {
            //_result.push([contributions[tokenId][i].TokenId,contributions[tokenId][i].Weight]);
            _result[i][0] = _contributions[tokenId][i].TokenId;
            _result[i][1] = _contributions[tokenId][i].Weight;
        }

        return _result;
    }

    function getLengthContrib(uint256 tokenId) external view returns (uint256) {
        return _contributions[tokenId].length;
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
}
