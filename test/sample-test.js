const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

describe("Greeter", function () {

  it("Should return the new greeting once it's changed", async function () {

    // deploy
    const [owner, first] = await ethers.getSigners(); // это массив аккаунтов

    const nftContractFactory = await hre.ethers.getContractFactory('KokokoNFT');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();

    console.log("Contract deployed to:", nftContract.address);
    expect(await first.getBalance()).to.equal(ethers.utils.parseEther('10000'));


    // mint nft success
    let txn = await nftContract.mint("kokoko", ethers.utils.parseEther('0.1'));
    await txn.wait();

    txn = await nftContract.mint("qqq", ethers.utils.parseEther('0.2'));
    await txn.wait();


    // mint nft error
    await expect(nftContract.connect(first).mint("qqq", ethers.utils.parseEther('0.2'))).to.be.revertedWith('Only founder');


    // expect owner of nft
    expect(await nftContract.ownerOf(0)).to.equal(owner.address);
    expect(await nftContract.ownerOf(1)).to.equal(owner.address);

    const items = await nftContract.fetchItems();
    console.log('items = ', items);

    const item = await nftContract.getItem(1);
    expect(item.price).to.equal(ethers.utils.parseEther('0.2'));

    expect(await nftContract.founder()).to.equal(owner.address);
    expect(await nftContract.royaltyFee()).to.equal(0);

    // sell nft without royalty success
    txn = await nftContract.connect(first).buyItem(1, {
      value: ethers.utils.parseEther("0.2")
    });
    await txn.wait();

    await expect(() => txn).to.changeEtherBalance(owner, ethers.utils.parseEther("0.2"));
    await expect(() => txn).to.changeEtherBalance(first, ethers.utils.parseEther("-0.2"));

    // check nft owner after sell
    expect(await nftContract.ownerOf(0)).to.equal(owner.address);
    expect(await nftContract.ownerOf(1)).to.equal(first.address);


    // change nft price success
    txn = await nftContract.connect(first).changeItemPrice(1, ethers.utils.parseEther('0.77'));
    await txn.wait();

    const item1 = await nftContract.getItem(1);
    expect(item1.price).to.equal(ethers.utils.parseEther('0.77'));


    // change nft price error
    await expect(nftContract.connect(first).changeItemPrice(0, ethers.utils.parseEther('0.77'))).to.be.revertedWith('Only owner');


    // change royalty
    txn = await nftContract.setRoyaltyFee(15);
    await txn.wait();

    expect(await nftContract.royaltyFee()).to.equal(15);


    // sell nft with royalty

    console.log('owner = ', await owner.getBalance())
    console.log('first = ', await first.getBalance())

    const buyItem1Amount = ethers.utils.parseEther("0.77");
    txn = await nftContract.buyItem(1, {
      value: buyItem1Amount
    });
    console.log('txn = ', txn);
    await txn.wait();

    console.log('owner1 = ', await owner.getBalance())
    console.log('first1 = ', await first.getBalance())

    const fee = buyItem1Amount * 15 / 100;
    const amount = buyItem1Amount - fee;

    await expect(() => txn).to.changeEtherBalance(owner, ethers.utils.parseUnits((-amount).toString(), 'wei'));
    await expect(() => txn).to.changeEtherBalance(first, ethers.utils.parseUnits(amount.toString(), 'wei'));
    // await expect(() => txn).to.changeEtherBalance(owner, ethers.utils.parseUnits(fee.toString(), 'wei'));

  });
});
