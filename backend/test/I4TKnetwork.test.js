const {
  loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
require("@nomicfoundation/hardhat-toolbox");
const I4TKnetworkJson = require('../artifacts/contracts/i4tKnetwork.sol/I4TKNetwork.json');
const I4TKtokenJson = require('../artifacts/contracts/I4TKdocToken.sol/I4TKdocToken.json');




const I4KTnetworkABI = I4TKnetworkJson.abi;
const I4KTtokenABI = I4TKtokenJson.abi;


describe("I4TK network contract tests", function () {

  //----------fixtures-----------//

  async function deployFixture() {


    const [deployer, searcher1, searcher2, validator1, validator2, validator3, validator4] = await ethers.getSigners();


    const contractToken = await ethers.getContractFactory("I4TKdocToken");
    const I4TKtoken = await contractToken.deploy();


    const contractNetwork= await ethers.getContractFactory("I4TKNetwork");
    const I4TKnetwork  = await contractNetwork.deploy(I4TKtoken.target);



    return { I4TKnetwork, deployer, searcher1, searcher2, validator1, validator2, validator3, validator4 };

  };

  async function defaultFixture() {


    const [deployer, searcher1, searcher2, validator1, validator2, validator3, validator4] = await ethers.getSigners();



    const contractToken = await ethers.getContractFactory("I4TKdocToken");
    const I4TKtoken = await contractToken.deploy();

    console.log(
      `token deployed to ${I4TKtoken.target}`
    );

    const contractNetwork= await ethers.getContractFactory("I4TKNetwork");
    const I4TKnetwork  = await contractNetwork.deploy(I4TKtoken.target);

    console.log(
      `contract deployed to ${I4TKnetwork .target}`
    );

    const tokendeployed = new hre.ethers.Contract(I4TKtoken.target, I4KTnetworkABI, deployer);
    const contractdeployed = new hre.ethers.Contract(I4TKnetwork .target, I4KTtokenABI, deployer);
    //const tx = await contractdeployed.registerMember(contract.target,1);

    const minterRole = await tokendeployed.MINTER_ROLE();

    const tx = await tokendeployed.grantRole(minterRole, contract.target);

    await tx.wait();

    console.log(deployer.address);

    const tx2 = await contractdeployed.registerMember(deployer.address, "3");

    await tx2.wait();

    console.log(await contractdeployed.Members(deployer.address));

    const tx3 = await contractdeployed.registerMember(addr1.address, "1");

    await tx3.wait();

    const tx4 = await contractdeployed.registerMember(addr2.address, "2");

    await tx4.wait();

    const tx5 = await contractdeployed.registerMember(addr3.address, "2");

    await tx5.wait();

    const tx6 = await contractdeployed.registerMember(addr4.address, "2");

    await tx6.wait();

    const tx7 = await contractdeployed.registerMember(addr5.address, "2");

    await tx7.wait();

    return { I4TKnetwork , searcher1, searcher2, validator1, validator2, validator3, validator4 };

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