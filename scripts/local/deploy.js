const fs = require('fs');
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const treasuryAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8'; // depends on local address values

  // We get the contract to deploy
  const MoodyMartian = await hre.ethers.getContractFactory("MoodyMartian");
  const martian = await MoodyMartian.deploy(treasuryAddress);

  const data = {
    address: martian.address,
    abi: JSON.parse(martian.interface.format('json'))
  };
  fs.writeFileSync(__dirname + '/../../src/MoodyMartian.json', JSON.stringify(data));

  console.log("Martian deployed to:", martian.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
