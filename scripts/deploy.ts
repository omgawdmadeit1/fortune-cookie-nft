import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const signerAddress = process.env.SIGNER_PRIVATE_KEY 
    ? new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY).address 
    : "0x0000000000000000000000000000000000000000"; // replace with real in .env

  if (signerAddress === "0x0000000000000000000000000000000000000000") {
    throw new Error("Set SIGNER_PRIVATE_KEY in .env or hardcode a real signer address for constructor");
  }

  const NFT = await ethers.getContractFactory("FortuneCookieNFT");
  const nft = await NFT.deploy(signerAddress);

  await nft.waitForDeployment();
  const address = await nft.getAddress();

  console.log("FortuneCookieNFT deployed to:", address);
  console.log("Signer (voucher authority):", signerAddress);
  console.log("Owner (deployer):", deployer.address);
  console.log("\nNext: npx hardhat verify --network baseSepolia", address, signerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});