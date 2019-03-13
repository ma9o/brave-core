const AdsRegistry = artifacts.require("AdsRegistry");
const fs = require('fs');

module.exports = function(deployer) {
  deployer.deploy(AdsRegistry).then(() => {
      return AdsRegistry.deployed().then((instance) => {
        fs.writeFile("address.txt", instance.address, (err) => {         
           console.log(err)
        })
        return instance.addCampaign("0x03eae1b8a69a497db1540488309a2b96", {value : 10000});
      });
  })
};
