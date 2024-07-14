const hre = require("hardhat");
require("@nomicfoundation/hardhat-ethers");
require('dotenv').config();


async function main() {

    
  const  [deployer ]= await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
    );


  const I4TKToken = await ethers.getContractFactory("I4TKdocToken");
  const token = await I4TKToken.deploy();
  

  console.log(
    `token deployed to ${token.target}`
  );

  const I4TKnetwork = await ethers.getContractFactory("I4TKNetwork");
  const contract = await I4TKnetwork.deploy(token.target);

  console.log(
    `contract deployed to ${contract.target}`
  );


  await token.waitForDeployment();
  await contract.waitForDeployment();  
  const minterRole= await token.MINTER_ROLE();

  const tx = await token.grantRole(minterRole,contract.target);

  await tx.wait();

  console.log(deployer.address);

  const tx2= await  contract.registerMember(deployer.address,"3");

  await tx2.wait();

  console.log( await contract.Members(deployer.address) );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


  //command: npx hardhat run scripts/I4Tknetwork_sepolia.s.js  --network sepolia

  //verify on etherscan TOKEN contract: npx hardhat verify --network sepolia contract_address

  //verify on etherscan TOKEN contract: npx hardhat verify --network sepolia contract_address "address token"

//token deployed to 0x431Dc5f0176Cf579Ce2D9A445B953fa9FC75f036
//contract deployed to 0x920800f339FA7b66342368D7ecAf1eEDcE40305E
