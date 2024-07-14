// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title I4TKNetwork contract
/// @author JC SEQUEIRA
/** @notice This contract implements all functions that govern the I4T knowledge Network protocol: a DeSci project
 *  supporting a community of researchers built around UNESCO's Internet for Trust (I4T) guidelines.
 *  The objective is to animate and structure a DAO around the following functionalities: authentication, peer-review, web of trust and publication.
 */
/** @dev All function calls are currently implemented without side effects
  * The I4TK network protocol is linked to a ERC1155 token to manage ownership of all content published by community members
  * Access to the contract functions are manage through access to function are managed through access role implemented with AccessControl contract from openzeppelin.
  * The contract can hold ERC1155 token.
 */
/// @custom:context This contract was done as final project in the frame of solidity-dev course taught by ALYRA.

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./I4TKdocToken.sol";

contract I4TKNetwork is AccessControl, ERC1155Holder {

    enum Profiles {
        publicUser,
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

    mapping(uint256 tokenId => mapping(address addr => bool)) public contentValidator;
    mapping(address => MetadataOfMember) public Members;
    mapping(uint256 tokenId => Status) public status;
    mapping(uint256 tokenId => uint256) public nbValidation;
    mapping(uint256 tokenId => uint256) proposedDate;

    error tokenInReferenceNotExistOrNotValidated(uint256 wrongTokenId);

    event memberRegistered(address addr, Profiles profile);
    event memberRevoked(address addr);
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

    /**  @dev At contract creation, the address of the token I4TKdocToken is set
      *  the deployer is granted with ADMIN_ROLE
     */
    constructor(address _I4TKdocTokenAddr) {
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

    /// @notice get the key of the Profiles Struct 
    /// @dev simple getter
    /// @param profile struct 
    /// @return string corresponding to key of the struct value given in @param
    function getProfilesKeyByValue(
        Profiles profile
    ) public pure returns (string memory) {
        if (Profiles.publicUser == profile) return "publicUser";
        if (Profiles.researcher == profile) return "researcher";
        if (Profiles.labs == profile) return "labs";
        if (Profiles.admin == profile) return "admin";
        return "";
    }

    /// @notice get the value of the Profiles Struct 
    /// @dev simple getter
    /// @param profile string representing a Profiles value
    /// @return value of Profiles struct corresponding to the key given in @param
    function getProfilesValueByKey(
        string memory profile
    ) external pure returns (Profiles) {
        if (keccak256(abi.encodePacked(profile)) == keccak256("publicUser"))
            return Profiles.publicUser;
        if (keccak256(abi.encodePacked(profile)) == keccak256("researcher"))
            return Profiles.researcher;
        if (keccak256(abi.encodePacked(profile)) == keccak256("labs"))
            return Profiles.labs;
        if (keccak256(abi.encodePacked(profile)) == keccak256("admin"))
            return Profiles.admin;
        revert();
    }

    /// @notice Register a new member and grant access role according to the user profiles provided
    /** @dev function can be called only by user having ADMIN_ROLE
      * emit a {memberRegistered} event.
     */
    /// @param addr address of the user
    /// @param profile profile value to be given to the user
    
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

    /// @notice revoke member from the community
    /** @dev function can be called only by user having ADMIN_ROLE
      * emit a {memberRevoked} event.
     */
    /// @param addr address of the user to revoke

    function revokeMember(
        address addr
    ) external onlyRole(ADMIN_ROLE) {
        require(
          Members[addr].isMember,
            "Cannot revoke because it is not a member"
        );


        if (Members[addr].profile == Profiles.researcher) {
            revokeRole(CONTRIBUTOR_ROLE, addr);
        }

        if (Members[addr].profile == Profiles.labs) {
            revokeRole(CONTRIBUTOR_ROLE, addr);
            revokeRole(VALIDATOR_ROLE, addr);
        }

        if (Members[addr].profile== Profiles.admin) {
            revokeRole(ADMIN_ROLE, addr);
        }

        Members[addr].profile = Profiles.publicUser;
        Members[addr].isMember = false;

        emit memberRevoked(addr);
    }


    /// @notice Function allowing a member to propose a new content to the community
    /** @dev function can be called only by user having CONTRIBUTOR_ROLE
      * by this function a new id of the token I4TKdocToken will be minted and deposit in this contract.
      * function will revert if a token list in the reference doesn't exist already.
      * Pay attention to provide the tokenURI in the good format.
      * emit a {contentProposed} event.
     */
    /// @param tokenURI URI of the new token created, the tokenURI must be formatted thanks to the function formatTokenURI() of the I4TKdocToken contract.
    /// @param references a array of the existing tokenId referenced in this new content proposed.

    function proposeContent(
        string memory tokenURI,
        uint256[] memory references
    ) external onlyRole(CONTRIBUTOR_ROLE) {
        for (uint256 i = 0; i < references.length; i++) {
            if (
                token.exists(references[i]) == false ||
                status[references[i]] != Status.validated
            ) {
                revert tokenInReferenceNotExistOrNotValidated({
                    wrongTokenId: references[i]
                });
            }
        }
        bytes memory data;
        address creator;
        creator = msg.sender;
        uint256 tokenId = token.mint(address(this), tokenURI, references, data);
        nbValidation[tokenId] = 0;
        status[tokenId] = Status.proposed;
        proposedDate[tokenId]=block.timestamp;

        emit contentProposed(creator, tokenId, tokenURI, block.timestamp);
    }


    /// @notice Function allowing a member to validate a content proposed by another member
    /** @dev function can be called only by user having VALIDATOR_ROLE
      * one validator can only validate the content once, the creator of the content cannot validate.
      * to the fourth validation, the tokens are released and sent to the creator of validated content and the creator of the content in reference. 
      * The distribution is done according to the protocol rules
      * emit a {contentValidation} event.
     */
    /// @param tokenId id of the token represented the content validated

    function valideContent(uint256 tokenId) external onlyRole(VALIDATOR_ROLE) {
        require(
            !contentValidator[tokenId][msg.sender] == true,
            "You have already validated this content"
        );
        require(
            token.getTokenCreator(tokenId) != msg.sender,
            "You are the creator of the content, you cannot validate it!"
        );

        nbValidation[tokenId]++;

        contentValidator[tokenId][msg.sender] = true;

        if (nbValidation[tokenId] == 4) {
            _distribution(tokenId);
            status[tokenId] = Status.validated;
            emit contentPublished(
                token.getTokenCreator(tokenId),
                tokenId,
                token.uri(tokenId),
                block.timestamp
            );
        }

        emit contentValidation(msg.sender, tokenId);
    }

    /// @notice function to distribute the quantity of a tokenId to all content's creators according to their ownership.
    /*  @dev private function. distribution done according to the protocol rules
     *  the distribution is done according the contribution array got from token contract
     */
    /// @param _tokenId id of the token that supply quantity will be distributed 
    function _distribution(uint _tokenId) private onlyRole(VALIDATOR_ROLE) {
        uint256 nbContrib = token.getLengthContrib(_tokenId);
        address _to;
        uint256[2][] memory contribList = new uint256[2][](nbContrib);
        contribList = token.getcontributions(_tokenId);
        uint256 qtyTokenInContractBeforeDistribution = token.balanceOf(address(this),_tokenId);

        for (uint256 i = 0; i < contribList.length; i++) {
            uint256 sourceTokenId = contribList[i][0];
            
            _to = token.getTokenCreator(sourceTokenId);
            uint256 _value = (qtyTokenInContractBeforeDistribution *
                contribList[i][1]) / 1e6;
            token.safeTransferFrom(address(this), _to, _tokenId, _value, "");
        }

        uint256 balanceContractTokenId = token.balanceOf(address(this), _tokenId);
        _to = token.getTokenCreator(_tokenId);

        if (balanceContractTokenId>0) {
            token.safeTransferFrom(address(this), _to, _tokenId, balanceContractTokenId, "");
        }
    }


}
