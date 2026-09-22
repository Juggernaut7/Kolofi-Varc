import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "USDC");

  const Vault = await ethers.getContractFactory("ArcVault");
  const vault = await Vault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("ArcVault:", vaultAddress);

  const Circle = await ethers.getContractFactory("ArcCircle");
  const circle = await Circle.deploy();
  await circle.waitForDeployment();
  const circleAddress = await circle.getAddress();
  console.log("ArcCircle:", circleAddress);

  console.log("\nAdd these to Kolofi-client/.env.local:");
  console.log(`NEXT_PUBLIC_ARC_VAULT_ADDRESS=${vaultAddress}`);
  console.log(`NEXT_PUBLIC_ARC_CIRCLE_ADDRESS=${circleAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
