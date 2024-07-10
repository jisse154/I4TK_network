const {
  loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
const I4TKnetworkJson = require('../artifacts/contracts/i4tKnetwork.sol/I4TKNetwork.json');
const I4TKtokenJson = require('../artifacts/contracts/I4TKdocToken.sol/I4TKdocToken.json');




const I4KTnetworkABI = I4TKnetworkJson.abi;
const I4KTtokenABI = I4TKtokenJson.abi;


describe("I4TK network contract tests", function () {

  //----------fixtures-----------//

  async function deployFixture() {


    const [deployer, searcher1, searcher2, validator1, validator2, validator3, validator4] = await hre.ethers.getSigners();


    const contractToken = await hre.ethers.getContractFactory("I4TKdocToken");
    const I4TKtoken = await contractToken.deploy();


    const contractNetwork = await ethers.getContractFactory("I4TKNetwork");
    const I4TKnetwork = await contractNetwork.deploy(I4TKtoken.target);



    return { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 };

  };

  async function defaultFixture() {


    const [deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public] = await ethers.getSigners();

    const contractToken = await ethers.getContractFactory("I4TKdocToken");
    const I4TKtoken = await contractToken.deploy();

    const contractNetwork = await ethers.getContractFactory("I4TKNetwork");
    const I4TKnetwork = await contractNetwork.deploy(I4TKtoken.target);


    //const tokendeployed = new hre.ethers.Contract(I4TKtoken.target, I4KTnetworkABI, deployer);
    //const contractdeployed = new hre.ethers.Contract(I4TKnetwork.target, I4KTtokenABI, deployer);
    //const tx = await contractdeployed.registerMember(contract.target,1);

    const minterRole = await I4TKtoken.MINTER_ROLE();


    await I4TKtoken.grantRole(minterRole, I4TKnetwork.target);


    await I4TKnetwork.registerMember(deployer.address, "3");

    await I4TKnetwork.registerMember(searcher1.address, "1");
    await I4TKnetwork.registerMember(searcher2.address, "1");

    await I4TKnetwork.registerMember(validator1.address, "2");

    await I4TKnetwork.registerMember(validator2.address, "2");

    await I4TKnetwork.registerMember(validator3.address, "2");

    await I4TKnetwork.registerMember(validator4.address, "2");

    return { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public };

  };



  //-----------------TEST DEPLOYMENT-------------------//
  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { I4TKtoken, I4TKnetwork, deployer } = await loadFixture(deployFixture);

      expect(await I4TKnetwork.owner()).to.equal(deployer.address);
    });

    it("Should set the DEFAULT_ADMIN_ROLE to deployer", async function () {
      const { I4TKtoken, I4TKnetwork, deployer } = await loadFixture(deployFixture);
      expect(await I4TKtoken.hasRole('0x0000000000000000000000000000000000000000000000000000000000000000', deployer.address)).to.equal(true);

    });



  });



  describe("Test contract I4TKnetwork functions", async function () {


    //-----------------test member registration Function------------------//
    describe("test member registration", async function () {

      it("Should revert if sender not have the ADMIN_role", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);
        await expect(I4TKnetwork.connect(searcher1).registerMember(public.address, 1)).to.be.revertedWithCustomError(I4TKnetwork, 'AccessControlUnauthorizedAccount').withArgs(searcher1.address, await I4TKnetwork.ADMIN_ROLE());
      });

      it("Should revert if profile is not in Profiles enum", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);
        await expect(I4TKnetwork.connect(deployer).registerMember(public.address, 4)).to.be.revertedWithoutReason();
      });

      it("Should revert if profile is 0 (publicUSer)", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);
        await expect(I4TKnetwork.connect(deployer).registerMember(public.address, 0)).to.be.revertedWith("Profile name not recognized!");
      });

      it("Should grant CONTRIBUTOR_ROLE if Profiles.researcher provided", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(public.address, 1);
        const CONTRIBUTOR_ROLE = await I4TKnetwork.CONTRIBUTOR_ROLE();
        expect(await I4TKnetwork.connect(deployer).hasRole(CONTRIBUTOR_ROLE, public.address)).to.equal(true);
      });

      it("Should grant CONTRIBUTOR_ROLE if Profiles.labs provided", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(public.address, 2);
        const CONTRIBUTOR_ROLE = await I4TKnetwork.CONTRIBUTOR_ROLE();
        expect(await I4TKnetwork.connect(deployer).hasRole(CONTRIBUTOR_ROLE, public.address)).to.equal(true);
      });


      it("Should grant VALIDATION_ROLE if Profiles.labs provided", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(public.address, 2);
        const VALIDATOR_ROLE = await I4TKnetwork.VALIDATOR_ROLE();
        expect(await I4TKnetwork.connect(deployer).hasRole(VALIDATOR_ROLE, public.address)).to.equal(true);
      });

      it("Should grant ADMIN_ROLE if Profiles.admin provided", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(public.address, 3);
        const ADMIN_ROLE = await I4TKnetwork.ADMIN_ROLE();
        expect(await I4TKnetwork.connect(deployer).hasRole(ADMIN_ROLE, public.address)).to.equal(true);
      });

      it("Should emit memberRegistered event", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await expect(I4TKnetwork.connect(deployer).registerMember(public.address, 3)).to.emit(I4TKnetwork, 'memberRegistered').withArgs(public.address, 3);
      });


    });

    //-----------------test member revoke Function------------------//
    describe("test member revokation", async function () {

      it("Should revert if sender not have the ADMIN_role", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);
        await I4TKnetwork.connect(deployer).registerMember(public.address, 1);
        await expect(I4TKnetwork.connect(searcher1).revokeMember(public.address)).to.be.revertedWithCustomError(I4TKnetwork, 'AccessControlUnauthorizedAccount').withArgs(searcher1.address, await I4TKnetwork.ADMIN_ROLE());
      });


      it("Should revoke CONTRIBUTOR_ROLE if researcher member", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(public.address, 1);
        const CONTRIBUTOR_ROLE = await I4TKnetwork.CONTRIBUTOR_ROLE();
        await I4TKnetwork.connect(deployer).revokeMember(public.address);
        expect(await I4TKnetwork.connect(deployer).hasRole(CONTRIBUTOR_ROLE, public.address)).to.equal(false);
      });

      it("Should revoke VALIDATOR_ROLE if Profiles.labs provided", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(public.address, 2);
        const VALIDATOR_ROLE = await I4TKnetwork.VALIDATOR_ROLE();
        await I4TKnetwork.connect(deployer).revokeMember(public.address);
        expect(await I4TKnetwork.connect(deployer).hasRole(VALIDATOR_ROLE, public.address)).to.equal(false);
      });


      it("Should revoke CONTRIBUTOR_ROLE if Profiles.labs provided", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(public.address, 2);
        const CONTRIBUTOR_ROLE = await I4TKnetwork.CONTRIBUTOR_ROLE();
        await I4TKnetwork.connect(deployer).revokeMember(public.address);
        expect(await I4TKnetwork.connect(deployer).hasRole(CONTRIBUTOR_ROLE, public.address)).to.equal(false);
      });

      it("Should revoke ADMIN_ROLE if Profiles.admin provided", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(public.address, 3);
        const ADMIN_ROLE = await I4TKnetwork.ADMIN_ROLE();
        await I4TKnetwork.connect(deployer).revokeMember(public.address);
        expect(await I4TKnetwork.connect(deployer).hasRole(ADMIN_ROLE, public.address)).to.equal(false);
      });

      it("Should emit memberRegistered event", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(public.address, 3);
        await expect(I4TKnetwork.connect(deployer).revokeMember(public.address)).to.emit(I4TKnetwork, 'memberRevoked').withArgs(public.address);
      });


    });

    //-----------------test propose content Function------------------//
    describe("test propose content function", async function () {

      it("Should revert if sender not have the CONTRIBUTOR_role", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);
        await expect(I4TKnetwork.connect(public).proposeContent("", [])).to.be.revertedWithCustomError(I4TKnetwork, 'AccessControlUnauthorizedAccount').withArgs(public.address, await I4TKnetwork.CONTRIBUTOR_ROLE());
      });

      it("Should revert if token in reference list not exist", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);
        await expect(I4TKnetwork.connect(searcher1).proposeContent("", [1])).to.be.revertedWithCustomError(I4TKnetwork, 'tokenInReferenceNotExistOrNotValidated').withArgs(1);
      });

      it("Should revert if token in reference list is not validated", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);
        const URI = "test";
        const reference = [];
        await I4TKnetwork.connect(searcher1).proposeContent(URI, reference);

        await expect(I4TKnetwork.connect(searcher2).proposeContent("", [0])).to.be.revertedWithCustomError(I4TKnetwork, 'tokenInReferenceNotExistOrNotValidated').withArgs(0);
      });

      it("Should mint tokenId 0 and check balance of I4TKnetwork contract is 100000000", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);
        const tokenId = 0;

        await I4TKnetwork.connect(searcher1).proposeContent("", []);

        expect(await I4TKtoken.balanceOf(I4TKnetwork.target, tokenId)).to.equal(100000000);
        expect(await I4TKnetwork.status(tokenId)).to.equal(0);
        expect(await I4TKnetwork.nbValidation(tokenId)).to.equal(0);
      });



      it("Should emit proposeContent event", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        const URI = "test";
        const reference = [];
        const tokenId = await I4TKtoken.lastTokenId();

        await expect(I4TKnetwork.connect(searcher1).proposeContent(URI, reference)).to.emit(I4TKnetwork, 'contentProposed').withArgs(searcher1.address, tokenId + BigInt(1), URI, (await ethers.provider.getBlock("latest")).timestamp + 1);
      });

    });


    //-----------------test valide content Function------------------//
    describe("test validate content function", async function () {


      it("Should revert if sender haven't the VALIDATOR_Role", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        const URI = "test";
        const reference = [];
        await I4TKnetwork.connect(searcher1).proposeContent(URI, reference);
        await expect(I4TKnetwork.connect(searcher2).valideContent(0)).to.be.revertedWithCustomError(I4TKnetwork, 'AccessControlUnauthorizedAccount').withArgs(searcher2.address, await I4TKnetwork.VALIDATOR_ROLE());

      });

      it("Should revert if sender have already validated the content", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        const URI = "test";
        const reference = [];
        await I4TKnetwork.connect(searcher1).proposeContent(URI, reference);
        await I4TKnetwork.connect(validator1).valideContent(0);

        await expect(I4TKnetwork.connect(validator1).valideContent(0)).to.be.revertedWith('You have already validated this content');
      });

      it("Should revert if validator validate it own content", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        const URI = "test";
        const reference = [];
        await I4TKnetwork.connect(validator1).proposeContent(URI, reference);

        await expect(I4TKnetwork.connect(validator1).valideContent(0)).to.be.revertedWith('You are the creator of the content, you cannot validate it!');
      });


      it("Should increment nbValidation after a validation", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        const URI = "test";
        const reference = [];
        await I4TKnetwork.connect(searcher1).proposeContent(URI, reference);
        await I4TKnetwork.connect(validator1).valideContent(0);
        expect(await I4TKnetwork.nbValidation(0)).to.equal(BigInt(1));
        await I4TKnetwork.connect(validator2).valideContent(0);
        expect(await I4TKnetwork.nbValidation(0)).to.equal(BigInt(2));

      });


      it("Should distribute token to the creator of the content after 4 validation ", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        const URI = "test";
        const reference = [];
        await I4TKnetwork.connect(searcher1).proposeContent(URI, reference);
        await I4TKnetwork.connect(validator1).valideContent(0);
        await I4TKnetwork.connect(validator2).valideContent(0);
        await I4TKnetwork.connect(validator3).valideContent(0);
        await I4TKnetwork.connect(validator4).valideContent(0);
        expect(await await I4TKtoken.balanceOf(searcher1.address, 0)).to.equal(100000000);

      });


      it("Should distribute token to the creator and creator of referenced content after 4 validation ", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        const URI = "test";
        const reference1 = [];
        const reference2 = [0];
        const reference3 = [0, 1];
        const reference4 = [2, 0, 1];
        const reference5 = [0, 1, 2, 3];

        await I4TKnetwork.connect(searcher1).proposeContent(URI, reference1);
        await I4TKnetwork.connect(validator1).valideContent(0);
        await I4TKnetwork.connect(validator2).valideContent(0);
        await I4TKnetwork.connect(validator3).valideContent(0);
        await I4TKnetwork.connect(validator4).valideContent(0);

        await I4TKnetwork.connect(searcher2).proposeContent(URI, reference2);
        await I4TKnetwork.connect(validator1).valideContent(1);
        await I4TKnetwork.connect(validator2).valideContent(1);
        await I4TKnetwork.connect(validator3).valideContent(1);
        await I4TKnetwork.connect(validator4).valideContent(1);

        await I4TKnetwork.connect(searcher1).proposeContent(URI, reference3);
        await I4TKnetwork.connect(validator1).valideContent(2);
        await I4TKnetwork.connect(validator2).valideContent(2);
        await I4TKnetwork.connect(validator3).valideContent(2);
        await I4TKnetwork.connect(validator4).valideContent(2);

        await I4TKnetwork.connect(searcher2).proposeContent(URI, reference4);
        await I4TKnetwork.connect(validator1).valideContent(3);
        await I4TKnetwork.connect(validator2).valideContent(3);
        await I4TKnetwork.connect(validator3).valideContent(3);
        await I4TKnetwork.connect(validator4).valideContent(3);

        await I4TKnetwork.connect(searcher2).proposeContent(URI, reference5);
        await I4TKnetwork.connect(validator1).valideContent(4);
        await I4TKnetwork.connect(validator2).valideContent(4);
        await I4TKnetwork.connect(validator3).valideContent(4);
        await I4TKnetwork.connect(validator4).valideContent(4);

        expect(await await I4TKtoken.balanceOf(searcher2.address, 3)).to.equal(50400000);
        expect(await await I4TKtoken.balanceOf(I4TKnetwork.target, 3)).to.equal(0);
        expect(await await I4TKtoken.balanceOf(searcher2.address, 4)).to.equal(55360000);

      });



      it("Should emit contentValidation event", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        const URI = "test";
        const reference = [];
        await I4TKnetwork.connect(searcher1).proposeContent(URI, reference);
        await expect(I4TKnetwork.connect(validator1).valideContent(0)).to.emit(I4TKnetwork, 'contentValidation').withArgs(validator1.address, 0);

      });

    });

  });


  describe("Test contract I4TKdocToken functions", async function () {


    describe("test mint function", async function () {

      it("Should revert if the sender has not the MINTER_Role", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);
        await expect(I4TKtoken.connect(searcher1).mint(public.address, "", [], "0x")).to.be.revertedWithCustomError(I4TKtoken, 'AccessControlUnauthorizedAccount').withArgs(searcher1.address, await I4TKtoken.MINTER_ROLE());
      });

      it("should create tokenId 0 & 1 and change state of tokenURI, _tokenIdReferences[tokenId], _creator[tokenId] and lastTokenId ", async function() {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);

        await I4TKtoken.connect(deployer).grantRole(await I4TKtoken.MINTER_ROLE(),searcher1.address);
        await I4TKtoken.connect(searcher1).mint(searcher1.address, "", [], "0x");
        await I4TKtoken.connect(searcher1).mint(searcher1.address, "", [], "0x");
        await I4TKtoken.connect(searcher1).mint(searcher1.address, "", [0,1], "0x");

        expect(await I4TKtoken.connect(searcher1).getTokenIdReferences(2)).to.deep.equal([BigInt(0),BigInt(1)]);
        expect(await I4TKtoken.connect(searcher1).getTokenCreator(2)).to.equal(searcher1.address);
        expect(await I4TKtoken.connect(searcher1).lastTokenId ()).to.equal(2);


      });

    });
    
    describe("test formatURI function", async function () {

      it( "Should return correct URI", async function () {
        const { I4TKtoken, I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4, public } = await loadFixture(defaultFixture);
        expect(await I4TKtoken.connect(searcher1).formatTokenURI(1,"test", "test","test", "test", "test", [] )).to.equal("data:application/json;base64,eyJuYW1lIjogIkk0VEsgZG9jdW1lbnQgVG9rZW4gIyAxIiwiZGVzY3JpcHRpb24iOiAiVG9rZW4gcmVwcmVzZW50aW5nIGEgY29udGVudCBwcm9wb3NlZCBieSBhIG1lbWJlciBvZiB0aGUgSTRLVCBuZXR3b3JrIGNvbW11bml0eSIsImNvbnRlbnRVUkkiOiAiaXBmczpcL1wvdGVzdCIsInByb3BlcnRpZXMiOiB7InRpdGxlIjogInRlc3QiLCJhdXRob3JzIjogInRlc3QiLCJkZXNjcmlwdGlvbiI6ICJ0ZXN0IiwicHJvZ3JhbW1lIjogInRlc3QiLCJjYXRlZ29yeSI6IFtdfX0=");
      });

    });

  });



});