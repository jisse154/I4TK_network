const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

const Addr="0x231e2558e9289A42E55690Fe7E47cFcb9F0644d2"

module.exports = buildModule("I4TkNetworkModule", (m) => {
  const tokenAddr = m.getParameter("_I4TKdocTokenAddr", Addr);
  

  const I4TKNetwork = m.contract("I4TKNetwork", [tokenAddr]);

  return { I4TKNetwork };
});
