const hre = require("hardhat");

async function main() {

  const {owner , addr1, addr2, addr3}=hre.ethers.getSigners();


  const I4TKNetwork = await hre.ethers.deployContract("I4TKNetwork");

  await I4TKNetwork.waitForDeployment();

  console.log(
    `Bank deployed to ${I4TKNetwork.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});