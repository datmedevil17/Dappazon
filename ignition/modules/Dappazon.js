const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("Dappazon", (m) => {


  const Dappazon = m.contract("Dappazon", []);

  return { Dappazon };
});

