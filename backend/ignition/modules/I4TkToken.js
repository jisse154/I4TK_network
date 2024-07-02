const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

const AdminAddr=process.env.DEV_ADDRESS

module.exports = buildModule("I4TkTokenModule", (m) => {
  const defaultAdminAddr = m.getParameter("defaultAdmin", AdminAddr);
  

  const I4TKdocToken = m.contract("I4TKdocToken", [defaultAdminAddr]);

  return { I4TKdocToken };
});