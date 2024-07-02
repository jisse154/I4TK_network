const hre = require("hardhat");
require("@nomicfoundation/hardhat-ethers");

async function main() {

    

  const[deployer]= await hre.ethers.getSigners();


  console.log(
    "Deploying contracts with the account:",
    deployer.address
    );



  const I4TKToken = await ethers.getContractFactory("I4TKdocToken");
  const token = await I4TKToken.deploy(deployer.address);


  console.log(
    `token deployed to ${token.target}`
  );

  const I4TKnetwork = await ethers.getContractFactory("I4TKdocToken");
  const contract = await I4TKnetwork.deploy(token.target);

  console.log(
    `contract deployed to ${contract.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


  //commande: npx hardhat run scripts/i4tknetwork.s.js  --network sepolia/localhost
