const hre = require("hardhat");
require("@nomicfoundation/hardhat-ethers");

async function main() {


  const  [deployer, addr1, addr2, addr3, addr4, addr5 ]= await hre.ethers.getSigners();


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
  console.log(minterRole);

  const tx = await token.grantRole(minterRole,contract.target);

  await tx.wait();

  console.log(deployer.address);

  const tx2= await  contract.registerMember(deployer.address,"3");

  await tx2.wait();

  console.log( await contract.Members(deployer.address) );

  const tx3= await  contract.registerMember(addr1.address,"1");

  await tx3.wait();

  const tx4= await  contract.registerMember(addr2.address,"2");

  await tx4.wait();

  const tx5= await  contract.registerMember(addr3.address,"2");

  await tx5.wait();

  const tx6= await  contract.registerMember(addr4.address,"2");

  await tx6.wait();

  const tx7= await  contract.registerMember(addr5.address,"2");

  await tx7.wait();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


  //command: npx hardhat run scripts/I4TKnetwork.s.js  --network localhost
