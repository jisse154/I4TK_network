require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  etherscan:{
    apiKey:  process.env.ETHERSCAN_API_KEY

  },
  // networks: {
  //   sepolia: {
  //     accounts: [`0x${process.env.PRIVATE_KEY}`],
  //     chainId: 11155111,
  //     url: process.env.RPC,
  //   },
  //}
};
