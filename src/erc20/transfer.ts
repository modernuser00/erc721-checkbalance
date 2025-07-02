import { ethers } from "ethers";
import {
  ERC20_CONTRACT_ADDRESS,
  ERC20_RECIPIENT_ADDRESS,
  PRIVATE_KEYS_PATH,
  RPC
} from "../helpers/constants";
import { ERC20_ABI } from "./abi";
import { getPrivateKeysFromLocalFile } from "../helpers";

const pkList = getPrivateKeysFromLocalFile(PRIVATE_KEYS_PATH);
const provider = new ethers.JsonRpcProvider(RPC);

(async function main() {
  // Get wallet addresses from private keys
  const walletAdressList = pkList.map(pk => {
    const wallet = new ethers.Wallet(pk, provider);
    return wallet.address;
  });

  const erc20Contract = new ethers.Contract(ERC20_CONTRACT_ADDRESS, ERC20_ABI, provider);

  //set a success count to track successful balance fetches
  let successCount = 0;
  // Iterate through each wallet address and fetch the balance
  for (let i = 0; i < walletAdressList.length; i++) {
    const walletAddress = walletAdressList[i];
    try {
      const balance = await erc20Contract.balanceOf(walletAddress);
      const decimals = await erc20Contract.decimals();
      const displayBalance = ethers.formatUnits(balance, decimals);
      console.log(`WALLET #${i + 1} ${walletAddress} \t BALANCE: ${displayBalance}`);
      if (balance > 0) {
        successCount++;
        // Transfer the balance to the recipient address
        const wallet = new ethers.Wallet(pkList[i], provider);
        const contractWithSigner = erc20Contract.connect(wallet);
        try {
          const tx = await (contractWithSigner as any).transfer(ERC20_RECIPIENT_ADDRESS, balance);
          console.log(`✅Transferred ${displayBalance} tokens from ${walletAddress} to ${ERC20_RECIPIENT_ADDRESS}.\nTx: https://hyperscan.com/tx/${tx.hash}`);
          await tx.wait();
        } catch (transferError: any) {
          console.error(`❌Error transferring tokens from ${walletAddress}:`, transferError.message);
        }

      }
    } catch (error: any) {
      console.error(`❌Error fetching balance for ${walletAddress}:`, error.message);
    }
  }
})()

