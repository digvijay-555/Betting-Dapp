const path = require("path");
const { ethers, artifacts } = require("hardhat");

const fs = require("fs");


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const minimum_bet =1000

  const Betting = await ethers.deployContract("Betting", [minimum_bet]);
  await Betting.waitForDeployment();

  console.log("Betting deployed to:",await Betting.getAddress());

  saveFrontendFiles(Betting, "Betting", await Betting.getAddress());
}

async function saveFrontendFiles(contract, name, address) {
  const contractsDir = path.join(__dirname, "../src/contract_data/");
  const contract_addr = address;

  // Ensure the directory exists
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, `${name}-address.json`),
    JSON.stringify({ address: contract_addr }, undefined, 2)
  );

  // Save contract ABI
  const contractArtifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(
    path.join(contractsDir, `${name}.json`),
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });