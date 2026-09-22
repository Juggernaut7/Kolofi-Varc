import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ArcVault", function () {
  it("creates, deposits, and withdraws after unlock", async function () {
    const [owner] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory("ArcVault");
    const vault = await Vault.deploy();

    const unlock = (await time.latest()) + 7 * 24 * 60 * 60;
    const goal = ethers.parseEther("10");

    await vault.createVault("Emergency", goal, unlock);
    await vault.deposit(1, { value: ethers.parseEther("5") });

    await expect(vault.withdraw(1)).to.be.revertedWithCustomError(vault, "StillLocked");

    await time.increaseTo(unlock);
    await expect(vault.withdraw(1)).to.changeEtherBalance(owner, ethers.parseEther("5"));
  });

  it("allows early withdraw when goal is met", async function () {
    const [owner] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory("ArcVault");
    const vault = await Vault.deploy();

    const unlock = (await time.latest()) + 365 * 24 * 60 * 60;
    const goal = ethers.parseEther("10");

    await vault.createVault("Goal", goal, unlock);
    await vault.deposit(1, { value: ethers.parseEther("10") });
    await expect(vault.withdraw(1)).to.changeEtherBalance(owner, ethers.parseEther("10"));
  });
});

describe("ArcCircle", function () {
  it("runs a full 2-member rotating circle", async function () {
    const [a, b] = await ethers.getSigners();
    const Circle = await ethers.getContractFactory("ArcCircle");
    const circle = await Circle.deploy();

    const amount = ethers.parseEther("1");
    await circle.createCircle("Friends", amount, 2);
    await circle.connect(b).joinCircle(1);

    await circle.connect(a).contribute(1, { value: amount });
    await circle.connect(b).contribute(1, { value: amount });

    await expect(circle.connect(a).claimPayout(1)).to.changeEtherBalance(a, ethers.parseEther("2"));

    await circle.connect(a).contribute(1, { value: amount });
    await circle.connect(b).contribute(1, { value: amount });
    await expect(circle.connect(b).claimPayout(1)).to.changeEtherBalance(b, ethers.parseEther("2"));

    const state = await circle.getCircle(1);
    expect(state.active).to.equal(false);
  });
});
