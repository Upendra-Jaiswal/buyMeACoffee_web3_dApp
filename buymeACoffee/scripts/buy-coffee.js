// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const Web3 = require("web3");
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
// import "@nomiclabs/hardhat-waffle";
// import "@nomiclabs/hardhat-ethers";

const hre = require("hardhat");

//returns the ether balance of given address
async function getBalance(address){
  const balanceBigInt =  await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);


}

//logs the ether balance for a lsit of addresses
async function printBalance(addresses){
  let idx=0;
  for(const address of addresses){
    console.log(`address ${idx} balance:`, await getBalance(address) );
    idx++;
  }
}

//logs he memos stored on chain from coffee purchases
async function printMemos(memos){
  for(const memo of memos){
    const timestamp = memo.timestamp;
    const tipper =  memo.name;
    const tipperaddress =  memo.from;
    const message= memo.message;
    console.log(`At ${timestamp},${tipper} (${tipperaddress}) commented: "${message}" `)
  }
}












async function main() {
  
  //get example accounts
const [owner,tipper,tipper2,tipper3] =  await hre.ethers.getSigners();
  //get the contract to deploy & deploy
const buymeacoffee=  await hre.ethers.getContractFactory("BuyMeACoffee");
const buyMeACoffee=await buymeacoffee.deploy();
await buyMeACoffee.deployed();
console.log("BuyMEACoffee deployed to", buyMeACoffee.address);

  //check balances before the coffee purchase

const addresses = [owner.address,tipper.address,buyMeACoffee.address]
console.log("--start--")
await printBalance(addresses)


  //buy the owner a few coffees
const tip = {value: hre.ethers.utils.parseEther("1")};
await buyMeACoffee.connect(tipper).buyCoffee("Carolina","Good content",tip);
await buyMeACoffee.connect(tipper2).buyCoffee("vitto","nice post",tip);
await buyMeACoffee.connect(tipper3).buyCoffee("Kay","I love my proof of knowledge NFT",tip);



  //check balance after coffee purchase
  console.log("--bought coffee--")
  await printBalance(addresses)
  
  //withdraw funds (collect tips)

await buyMeACoffee.connect(owner).withdrawTips();

  //check balance after withdrwa
  console.log("--withdraw tips --")
  await printBalance(addresses)
  //read all memos left for the owner
  console.log("--printing memos  --")
const memos = await buyMeACoffee.getMemos();
printMemos(memos);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
