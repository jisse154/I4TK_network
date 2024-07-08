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



    return { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 };

  };

  async function defaultFixture() {


    const [deployer, searcher1, searcher2, validator1, validator2, validator3, validator4] = await ethers.getSigners();

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

    return { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 };

  };

  // function generateFixture defineD to generate a fixture to a specific workflowStatus state
  // function generateFixture(statusId) {

  //   let fixture = async function deployToSpecificStatusFixture() {

  //     const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
  //     const voters = [addr1, addr2, addr3];

  //     const proposals = ["propal1", "propal2", "propal3"];
  //     const votes = [1, 3, 3];

  //     const contract = await ethers.getContractFactory("Voting");

  //     const voting = await contract.deploy();

  //     if (statusId >= 0) {

  //       for (let i = 0; i < voters.length; i++) {
  //         let address = voters[i].address;
  //         await voting.addVoter(address);
  //       };
  //     };

  //     if (statusId >= 1) {
  //       await voting.startProposalsRegistering();

  //       for (let i = 0; i < proposals.length; i++) {
  //         await voting.connect(addr1).addProposal(proposals[i])
  //       };
  //     };

  //     if (statusId >= 2) {
  //       await voting.endProposalsRegistering();
  //     };


  //     if (statusId >= 3) {
  //       await voting.startVotingSession();

  //       for (let i = 0; i < votes.length; i++) {
  //         await voting.connect(voters[i]).setVote(votes[i]);
  //       };
  //     };

  //     if (statusId >= 4) {
  //       await voting.endVotingSession();
  //     };

  //     if (statusId == 5) {
  //       await voting.tallyVotes();

  //     };

  //     return { voting, owner, addr1, addr2, addr3, addr4 };
  //   };

  //   return fixture;
  // }


  //-----------------TEST DEPLOYMENT-------------------//
  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { I4TKnetwork, deployer } = await loadFixture(deployFixture);

      expect(await I4TKnetwork.owner()).to.equal(deployer.address);
    });



  });


  //-----------------TEST GETTER FUNCTIONS------------------//

  describe("Test contract functions", async function () {


 //-----------------test member registration Function------------------//
    describe("test member registration", async function () {

      it("Should revert if sender not have the ADMIN_role", async function () {
        const { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 } = await loadFixture(defaultFixture);
        await expect(I4TKnetwork.connect(searcher1).registerMember(searcher2.address, 1)).to.be.revertedWithCustomError(I4TKnetwork, 'AccessControlUnauthorizedAccount').withArgs(searcher1.address, await I4TKnetwork.ADMIN_ROLE());
      });

      it("Should revert if profile is not in Profiles enum", async function () {
        const { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 } = await loadFixture(defaultFixture);
        await expect(I4TKnetwork.connect(deployer).registerMember(searcher2.address, 4)).to.be.revertedWithoutReason();
      });

      it("Should revert if profile is 0 (publicUSer)", async function () {
        const { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 } = await loadFixture(defaultFixture);
        await expect(I4TKnetwork.connect(deployer).registerMember(searcher2.address, 0)).to.be.revertedWith("Profile name not recognized!");
      });

      it("Should grant CONTRIBUTOR_ROLE if Profiles.researcher provided", async function () {
        const { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(searcher2.address, 1);
        const CONTRIBUTOR_ROLE= await I4TKnetwork.CONTRIBUTOR_ROLE();
        expect(await I4TKnetwork.connect(deployer).hasRole(CONTRIBUTOR_ROLE,searcher2.address)).to.equal(true);
      });

      it("Should grant CONTRIBUTOR_ROLE if Profiles.labs provided", async function () {
        const { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(searcher2.address, 2);
        const CONTRIBUTOR_ROLE= await I4TKnetwork.CONTRIBUTOR_ROLE();
        expect(await I4TKnetwork.connect(deployer).hasRole(CONTRIBUTOR_ROLE,searcher2.address)).to.equal(true);
      });

      
      it("Should grant CONTRIBUTOR_ROLE if Profiles.labs provided", async function () {
        const { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(searcher2.address, 2);
        const VALIDATOR_ROLE= await I4TKnetwork.CONTRIBUTOR_ROLE();
        expect(await I4TKnetwork.connect(deployer).hasRole(VALIDATOR_ROLE,searcher2.address)).to.equal(true);
      });

      it("Should grant ADMIN_ROLE if Profiles.admin provided", async function () {
        const { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 } = await loadFixture(defaultFixture);

        await I4TKnetwork.connect(deployer).registerMember(searcher2.address, 3);
        const ADMIN_ROLE= await I4TKnetwork.CONTRIBUTOR_ROLE();
        expect(await I4TKnetwork.connect(deployer).hasRole(ADMIN_ROLE,searcher2.address)).to.equal(true);
      });

      it("Should emit memberRegistered event", async function () {
        const { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 } = await loadFixture(defaultFixture);

        await expect(I4TKnetwork.connect(deployer).registerMember(searcher2.address, 3)).to.emit(I4TKnetwork, 'memberRegistered').withArgs(searcher2.address, 3);
      });


    });




  });



  //-----------------TEST PUBLIC STORAGE VARIABLE-------------------//




  //-----------------FULL TEST FUNCTION-------------------//
  // for this Projet2, I have only tested function setVote()

  // describe("full test function setVote", function () {

  //   it("Should revert if sender not a voter", async function () {
  //     myfixture = generateFixture(WorkflowStatus.VotingSessionStarted);

  //     const { voting, owner, addr1, addr2, addr3, addr4 } = await loadFixture(myfixture);
  //     let proposalId = 1;

  //     await expect(voting.connect(addr4).setVote(proposalId)).to.be.revertedWith("You're not a voter");
  //   });

  //   it("Should revert if workflowStatus is not VotingSessionStarted", async function () {

  //     const myfixture = generateFixture(WorkflowStatus.ProposalsRegistrationEnded);

  //     const { voting, owner, addr1 } = await loadFixture(myfixture);
  //     let proposalId = 1;

  //     await expect(voting.connect(addr1).setVote(proposalId)).to.be.revertedWith('Voting session havent started yet');

  //   });

  //   it("Should revert because voter has already voted", async function () {
  //     myfixture = generateFixture(WorkflowStatus.VotingSessionStarted);

  //     const { voting, owner, addr1 } = await loadFixture(myfixture);
  //     let proposalId = 1;

  //     await expect(voting.connect(addr1).setVote(proposalId)).to.be.revertedWith("You have already voted");
  //   });

  //   it("Should revert because Proposal not found", async function () {
  //     myfixture = generateFixture(WorkflowStatus.ProposalsRegistrationEnded);

  //     const { voting, owner, addr1 } = await loadFixture(myfixture);
  //     let proposalId = 5;

  //     await voting.startVotingSession();

  //     await expect(voting.connect(addr1).setVote(proposalId)).to.be.revertedWith("Proposal not found");
  //   });

  //   it("Should voteCount is incremented after a vote", async function () {
  //     myfixture = generateFixture(WorkflowStatus.ProposalsRegistrationEnded);

  //     const { voting, owner, addr1 } = await loadFixture(myfixture);
  //     let proposalId = 1;

  //     let votecountbefore = Number((await voting.connect(addr1).getOneProposal(proposalId)).voteCount);
  //     await voting.startVotingSession();
  //     await voting.connect(addr1).setVote(proposalId)
  //     let votecountafter = Number((await voting.connect(addr1).getOneProposal(proposalId)).voteCount);

  //     expect(votecountafter).to.equal(votecountbefore + 1);
  //   });

  //   it("Should set voter hasVoted = True", async function () {
  //     myfixture = generateFixture(WorkflowStatus.ProposalsRegistrationEnded);

  //     const { voting, owner, addr1 } = await loadFixture(myfixture);
  //     let proposalId = 1;

  //     expect((await voting.connect(addr1).getVoter(addr1.address)).hasVoted).to.equal(false);

  //     await voting.startVotingSession();
  //     await voting.connect(addr1).setVote(proposalId);

  //     expect((await voting.connect(addr1).getVoter(addr1.address)).hasVoted).to.equal(true);

  //   });

  //   it("Should emit voted event", async function () {
  //     myfixture = generateFixture(WorkflowStatus.ProposalsRegistrationEnded);

  //     const { voting, owner, addr1 } = await loadFixture(myfixture);

  //     expect((await voting.connect(addr1).getVoter(addr1.address)).hasVoted).to.equal(false);

  //     await voting.startVotingSession();
  //     let proposalId = 1;


  //     await expect(voting.connect(addr1).setVote(proposalId)).to.emit(voting, 'Voted').withArgs(addr1.address, proposalId);

  //   });


  // });
});