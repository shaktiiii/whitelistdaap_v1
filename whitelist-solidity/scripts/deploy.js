const hre = require("hardhat");

async function main() {
  const whiteListContract = await hre.ethers.getContractFactory("Whitelist");

  const deployedWhiteListContract = await whiteListContract.deploy(10);

  await deployedWhiteListContract.deployed();

  console.log("WhiteList Contract Address: ", deployedWhiteListContract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
