const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("Weak randomness", function () {
    let deployer, attacker, user;
    beforeEach(async function() {
        [deployer, attacker, user] = await ethers.getSigners();
        const Lottery = await ethers.getContractFactory("Lottery", deployer);
        this.lottery = await Lottery.deploy();
    });

    describe("Lottery", function() {
        describe.skip("With bets open", function() {
            it("should allow a user to place a bet", async function() {
                await this.lottery.placeBet(5, {value: ethers.utils.parseEther("10")});
                expect (await this.lottery.bets(deployer.address)).to.eq(5);
            });

            it("should revert if user place more than 1 bet", async function() {
                await this.lottery.placeBet(5, {value: ethers.utils.parseEther("10")});
                await expect (this.lottery.placeBet(150, { value: ethers.utils.parseEther("10") })).to.be.revertedWith("Only 1 bet per player");
            });

            it("should revert if bet is not 10 eth", async function() {
                await expect (this.lottery.placeBet(150, { value: ethers.utils.parseEther("5") })).to.be.revertedWith("Bet cost: 10 ETH");
                await expect (this.lottery.placeBet(150, { value: ethers.utils.parseEther("15") })).to.be.revertedWith("Bet cost: 10 ETH");
            });

            it("should revert if bet is <= 0", async function() {
                await expect (this.lottery.placeBet(0, { value: ethers.utils.parseEther("10") })).to.be.revertedWith("Must be a number from 1 to 255");
            });
        });

        describe("With bets open", function() {
            it("Should revert if a user place a bet ", async function() {
                await this.lottery.endLottery();
                await expect (this.lottery.placeBet(150, { value: ethers.utils.parseEther("10") })).to.be.revertedWith("Bets are closed");             
            });

            it("Should allow only the winner to withdraw the prize", async function() {
                await this.lottery.connect(user).placeBet(5, { value: ethers.utils.parseEther("10") });
                await this.lottery.connect(attacker).placeBet(100, { value: ethers.utils.parseEther("10") });
                await this.lottery.placeBet(82, { value: ethers.utils.parseEther("10") });
            });
        });
    });
});