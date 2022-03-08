const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Weak randomness", function () {
    let deployer, attacker, user;
    beforeEach(async function() {
        [deployer, attacker, user] = await ethers.getSigners();
        const Lottery = await ethers.getContractsFactory("Lottery", deployer);
        this.lottery = await Lottery.deploy();
    });
});