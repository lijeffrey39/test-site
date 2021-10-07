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

  // We get the contract to deploy
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");
  // await greeter.setGreeting("bitch");

  const treasuryAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8'; // depends on local address values
  const donationAddress = '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'; // depends on local address values
  const ownerAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'; // depends on local address values

  const CryptoSpesh = await hre.ethers.getContractFactory("CryptoSpesh");
  const spesh = await CryptoSpesh.deploy(treasuryAddress, donationAddress);

  await spesh.buyMultipleSpesh(5, { value: ethers.utils.parseEther("0.5") });

  const speshForOwner = await spesh.listSpeshForOwner(ownerAddress);
  console.log(speshForOwner);

  await spesh.deployed();

  console.log("Spesh deployed to:", spesh.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
