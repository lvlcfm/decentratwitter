const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Decentratwitter", function () {
  let decentratwitter;
  let deployer, user1, user2, users;
  let URI = "SampleURI";
  let postHash = "SampleHash";
  beforeEach(async () => {
    // Gte signres from development accounts
    [deployer, user1, user2, ...users] = await ethers.getSigners();
    // We geet the contract factory to deploy thee contract
    const DecentratwitterFactory = await ethers.getContractFactory(
      "Decentratwitter",
    );
    // Deploy contract
    decentratwitter = await DecentratwitterFactory.deploy();
    // user1 mints an nfts
    await decentratwitter.connect(user1).mint(URI);
  });

  describe("Deployment", async () => {
    it("Should track name and symbol", async function () {
      const nftName = "Decentratwitter";
      const nftSymbol = "DAPP";
      expect(await decentratwitter.name()).to.equal(nftName);
      expect(await decentratwitter.symbol()).to.equal(nftSymbol);
    });
  });
  describe("Minting NFTs", async () => {
    it("Should track each minted NFT", async function () {
      expect(await decentratwitter.tokenCount()).to.equal(1);
      expect(await decentratwitter.balanceOf(user1.address)).to.equal(1);
      expect(await decentratwitter.tokenURI(1)).to.equal(URI);
      //user2 mints an nft
      await decentratwitter.connect(user2).mint(URI);
      expect(await decentratwitter.tokenCount()).to.equal(2);
      expect(await decentratwitter.balanceOf(user2.address)).to.equal(1);
      expect(await decentratwitter.tokenURI(2)).to.equal(URI);
    });
  });
  describe("Setting profiles", async () => {
    it("Should allow users to select which NFT they own to represent their profile", async function () {
      //user 1 mints another NFT
      await decentratwitter.connect(user1).mint(URI);
      // By default the users profile is set to their lsat minted NFT
      expect(await decentratwitter.profiles(user1.address)).to.equal(2);
      //user 1 sets profile to first minted nft
      await decentratwitter.connect(user1).setProfile(1);
      expect(await decentratwitter.profiles(user1.address)).to.equal(1);
      // FAIL CASE //
      // user 2 tries to set their profile to nft number 2 owned by user 1
      await expect(
        decentratwitter.connect(user2).setProfile(2),
      ).to.be.revertedWith(
        "Must own the nft you want to select as your profile",
      );
    });
  });
});
