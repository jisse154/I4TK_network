// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./I4TKdocToken.sol";



contract I4TKNetwork is Ownable, AccessControl, ERC1155Holder {

    enum Profiles {
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
    //bytes32 public constant READONLY_ROLE = keccak256("READONLY_ROLE");
    bytes32 public constant CONTRIBUTOR_ROLE = keccak256("CONTRIBUTOR_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    struct MetadataOfMember {
        Profiles profile;
        bool isMember;
    }

    struct Validator {
        address validatorAddr;
        bool hasValidated;
    }

    mapping (uint256=> Validator) public validator;

    event memberRegistered(address _addr, Profiles  _profile);
    event contentProposed(address _addr, uint256 _tokenID );
    event contentValidation(address _addr, uint256 _tokenID);

    mapping(address => MetadataOfMember) public Members;
    mapping(uint256 => Status) public status;
    mapping(uint256 => uint256) public nbValidation;


    constructor(address _I4TKdocTokenAddr) Ownable(msg.sender) {

        I4TKdocTokenAddr=_I4TKdocTokenAddr;
        token=I4TKdocToken(I4TKdocTokenAddr);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(CONTRIBUTOR_ROLE, ADMIN_ROLE);
        _setRoleAdmin(VALIDATOR_ROLE, ADMIN_ROLE);
    }

    // function memberApply( string memory _name , string memory _contractName, string memory _contractEmail, string memory _typeName) external {
    //     memberMetadata[msg.sender].name=  _name ;
    //     memberMetadata[msg.sender].contractName= _contractName;
    //     memberMetadata[msg.sender].contractEmail=  _contractEmail;
    //     memberMetadata[msg.sender].typeName= _typeName;
    //     applyAddrIndex[msg.sender]= applications.length;
    //     applications.push(msg.sender);
    // }

    // function applicationsRemove(uint index)  private returns(address[] storage) {
    //     if (index >= applications.length) return applications;

    //     for (uint i = index; i<applications.length-1; i++){
    //         applications[i] = applications[i+1];
    //     }
    //     delete applications[applications.length-1];
    //     applications.pop();
    //     return applications;
    // }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC1155Holder) returns (bool) {
        return (
            AccessControl.supportsInterface(interfaceId) ||
            ERC1155Holder.supportsInterface(interfaceId) ||
            super.supportsInterface(interfaceId)
        );

    }

    function getProfilesKeys() public pure  returns (string memory, string memory , string memory) {
        return ("Researcher", "labs", "Admin");
    }

    function getProfilesKeyByValue(Profiles profile) public pure  returns (string memory) {
        if (Profiles.researcher == profile) return "Researcher";
        if (Profiles.labs == profile) return "Labs";
        if (Profiles.admin == profile) return "Admin";
        return "";
    }

    function getProfilesValueByKey(string memory _profile) external pure returns (Profiles) {
        if (keccak256(abi.encodePacked(_profile)) == keccak256("Researcher")) return Profiles.researcher;
        if (keccak256(abi.encodePacked(_profile)) == keccak256("Labs")) return Profiles.labs;
        if (keccak256(abi.encodePacked(_profile)) == keccak256("Admin")) return Profiles.admin;
        revert();
    }

    function registerMember(
        address _addr,
        Profiles _profile
    ) external onlyRole(ADMIN_ROLE) {
        require(
            _profile == Profiles.researcher ||
                _profile == Profiles.labs ||
                _profile == Profiles.admin,
            "Profile name not recognized!"
        );

        if (_profile == Profiles.researcher) {
            grantRole(CONTRIBUTOR_ROLE, _addr);
            token.grantRole(keccak256("MINTER_ROLE"),_addr);

            //add token roles
        }

        if (_profile == Profiles.labs) {
            grantRole(CONTRIBUTOR_ROLE, _addr);
            grantRole(VALIDATOR_ROLE, _addr);
            token.grantRole(keccak256("MINTER_ROLE"),_addr);

            //add token roles

        }

        if (_profile == Profiles.admin) {
            grantRole(ADMIN_ROLE, _addr);
            token.grantRole(keccak256("DEFAULT_ADMIN_ROLE"),_addr);
        }

        Members[_addr].profile= _profile;
        Members[_addr].isMember = true;
        // applications=applicationsRemove(applyAddrIndex[_addr]);

        emit memberRegistered(_addr, _profile);
    }

    function proposeContent(string memory _tokenURI,uint256[] memory _references) external onlyRole(CONTRIBUTOR_ROLE) {

        bytes memory data;
        address _creator;
        _creator=msg.sender;
        uint256 tokenId = token.mint( address(this) ,_tokenURI,_references, data);
        nbValidation[tokenId]=0;
        status[tokenId]=Status.proposed;
        emit contentProposed(_creator, tokenId);


    }


    function validation(uint256 _tokenId) external onlyRole(VALIDATOR_ROLE) {
        require(!validator[_tokenId].hasValidated, "You have already validated this content");


        nbValidation[_tokenId]++;
        Validator memory _validator;
        _validator.validatorAddr=msg.sender;
        _validator.hasValidated=true;

        validator[_tokenId]=_validator;
        if (nbValidation[_tokenId] ==4) {
            _distribution(_tokenId);
        }

        emit contentValidation(msg.sender, _tokenId);


    }  


    function _distribution(uint _tokenId) private onlyRole(VALIDATOR_ROLE){

        uint256 nbContrib=token.getLengthContrib(_tokenId);

        uint256[2][] memory contribList = new uint256[2][](nbContrib);
        contribList=token.getcontributions(_tokenId, nbContrib);

        for(uint256 i=0; i<contribList.length; i++) {
            uint256 tokenIdToSend= contribList[i][0];
            address _to;
            _to = token.creator(tokenIdToSend);
            uint256 _value=token.balanceOf(address(this),tokenIdToSend) * contribList[i][1] / 1e6;
            token.safeTransferFrom(address(this), _to, tokenIdToSend, _value,"");

        }


    }
    //function trashEmpty() 

}
