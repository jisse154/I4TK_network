// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";


contract I4TKNetwork is Ownable, AccessControl, ERC1155Holder {

    enum Profiles {
        researcher,
        labs,
        admin
    }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    //bytes32 public constant READONLY_ROLE = keccak256("READONLY_ROLE");
    bytes32 public constant CONTRIBUTOR_ROLE = keccak256("CONTRIBUTOR_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    struct MetadataOfMember {
        Profiles profile;
        bool isMember;
    }


    event memberRegistered(address _addr, Profiles  _profile);

    mapping(address => MetadataOfMember) public Members;
    mapping(address => uint256) applyAddrIndex;

    constructor() Ownable(msg.sender) {
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

            //add token roles
        }

        if (_profile == Profiles.labs) {
            grantRole(CONTRIBUTOR_ROLE, _addr);
            grantRole(VALIDATOR_ROLE, _addr);

            //add token roles

        }

        if (_profile == Profiles.admin) {
            grantRole(ADMIN_ROLE, _addr);
        }

        Members[_addr].profile= _profile;
        Members[_addr].isMember = true;
        // applications=applicationsRemove(applyAddrIndex[_addr]);

        emit memberRegistered(_addr, _profile);
    }

    //function proposeContent() {}
}
