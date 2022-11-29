const hre = require("hardhat");

async function main(){
    const buymeacoffee=  await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee=await buymeacoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMEACoffee deployed to", buyMeACoffee.address);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  