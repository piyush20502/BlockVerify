const hre = require("hardhat");

async function main() {
  console.log("Deploying MarksVerification contract...");
  
  // Get the contract factory
  const MarksVerification = await hre.ethers.getContractFactory("MarksVerification");
  
  // Deploy the contract
  console.log("Deploying...");
  const marksVerification = await MarksVerification.deploy();
  
  // Wait for deployment to complete
  await marksVerification.deployed();
  
  console.log(`MarksVerification deployed to: ${marksVerification.address}`);
  
  // Verification for public networks
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations before verification...");
    
    // Wait for 6 block confirmations
    await marksVerification.deployTransaction.wait(6);
    
    // Verify contract on Etherscan
    try {
      console.log("Verifying contract...");
      await hre.run("verify:verify", {
        address: marksVerification.address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      if (error.message.includes("Already Verified")) {
        console.log("Contract is already verified");
      } else {
        console.error("Verification failed:", error);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });