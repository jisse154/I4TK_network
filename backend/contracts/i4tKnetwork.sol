// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./I4TKdocToken.sol";

contract I4TKNetwork is Ownable, AccessControl, ERC1155Holder {
    enum Profiles {
        publicUSer,
        researcher,
        labs,
        admin
    }

    enum Status {
        proposed,
        validated,
        trash,
        removed
    }

    address public I4TKdocTokenAddr;
    I4TKdocToken token;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CONTRIBUTOR_ROLE = keccak256("CONTRIBUTOR_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    struct MetadataOfMember {
        Profiles profile;
        bool isMember;
    }


    mapping(uint256 tokenId => mapping( address addr => bool)) public contentValidator;
    mapping(address => MetadataOfMember) public Members;
    mapping(uint256 tokenId => Status) public status;
    mapping(uint256 tokenId => uint256) public nbValidation;

    event memberRegistered(address addr, Profiles profile);
    event contentProposed(
        address indexed creator,
        uint256 indexed tokenId,
        string tokenURI,
        uint256 date
    );
    event contentValidation(address indexed validator, uint256 indexed tokenId);
    event contentPublished(
        address indexed creator,
        uint256 indexed tokenId,
        string tokenURI,
        uint256 date
    );

    constructor(address _I4TKdocTokenAddr) Ownable(msg.sender) {
        I4TKdocTokenAddr = _I4TKdocTokenAddr;
        token = I4TKdocToken(I4TKdocTokenAddr);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(CONTRIBUTOR_ROLE, ADMIN_ROLE);
        _setRoleAdmin(VALIDATOR_ROLE, ADMIN_ROLE);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC1155Holder) returns (bool) {
        return (AccessControl.supportsInterface(interfaceId) ||
            ERC1155Holder.supportsInterface(interfaceId) ||
            super.supportsInterface(interfaceId));
    }

    function getProfilesKeys()
        public
        pure
        returns (string memory, string memory, string memory, string memory)
    {
        return ("publicUser", "researcher", "labs", "admin");
    }

    function getProfilesKeyByValue(
        Profiles profile
    ) public pure returns (string memory) {
        if (Profiles.publicUSer == profile) return "publicUser";
        if (Profiles.researcher == profile) return "researcher";
        if (Profiles.labs == profile) return "labs";
        if (Profiles.admin == profile) return "admin";
        return "";
    }

    function getProfilesValueByKey(
        string memory profile
    ) external pure returns (Profiles) {
        if (keccak256(abi.encodePacked(profile)) == keccak256("publicUser"))
            return Profiles.publicUSer;
        if (keccak256(abi.encodePacked(profile)) == keccak256("researcher"))
            return Profiles.researcher;
        if (keccak256(abi.encodePacked(profile)) == keccak256("labs"))
            return Profiles.labs;
        if (keccak256(abi.encodePacked(profile)) == keccak256("admin"))
            return Profiles.admin;
        revert();
    }

    function registerMember(
        address addr,
        Profiles profile
    ) external onlyRole(ADMIN_ROLE) {
        require(
            profile == Profiles.researcher ||
                profile == Profiles.labs ||
                profile == Profiles.admin,
            "Profile name not recognized!"
        );

        if (profile == Profiles.researcher) {
            grantRole(CONTRIBUTOR_ROLE, addr);
        }

        if (profile == Profiles.labs) {
            grantRole(CONTRIBUTOR_ROLE, addr);
            grantRole(VALIDATOR_ROLE, addr);
        }

        if (profile == Profiles.admin) {
            grantRole(ADMIN_ROLE, addr);
        }

        Members[addr].profile = profile;
        Members[addr].isMember = true;

        emit memberRegistered(addr, profile);
    }

    function proposeContent(
        string memory tokenURI,
        uint256[] memory references
    ) external onlyRole(CONTRIBUTOR_ROLE) {
        bytes memory data;
        address creator;
        creator = msg.sender;
        uint256 tokenId = token.mint(address(this), tokenURI, references, data);
        nbValidation[tokenId] = 0;
        status[tokenId] = Status.proposed;

        emit contentProposed(creator, tokenId, tokenURI, block.timestamp);
    }

    function valideContent(uint256 tokenId) external onlyRole(VALIDATOR_ROLE) {
        require(
            !contentValidator[tokenId][msg.sender] == true,
            "You have already validated this content"
        );

        nbValidation[tokenId]++;


        contentValidator[tokenId][msg.sender] = true;
        if (nbValidation[tokenId] == 4) {
            _distribution(tokenId);
            emit contentPublished(
                token.getTokenCreator(tokenId),
                tokenId,
                token.uri(tokenId),
                block.timestamp
            );
        }

        emit contentValidation(msg.sender, tokenId);
    }

    function _distribution(uint _tokenId) private onlyRole(VALIDATOR_ROLE) {
        uint256 nbContrib = token.getLengthContrib(_tokenId);

        uint256[2][] memory contribList = new uint256[2][](nbContrib);
        contribList = token.getcontributions(_tokenId, nbContrib);

        for (uint256 i = 0; i < contribList.length; i++) {
            uint256 sourceTokenId = contribList[i][0];
            address _to;
            _to = token.getTokenCreator(sourceTokenId);
            uint256 _value = (token.balanceOf(address(this), _tokenId) *
                contribList[i][1]) / 1e6;
            token.safeTransferFrom(
                address(this),
                _to,
                _tokenId,
                _value,
                ""
            );
        }
    }
    //function trashEmpty()
}
