import { ethers } from 'ethers';
import { getPublicKeysFromLocalFile } from './helpers';
import { COLLECTION_ADDRESS, PUBLIC_KEYS_PATH, RPC } from './helpers/constants';

// Load wallet addresses from the public keys file
const walletAdressList = getPublicKeysFromLocalFile(PUBLIC_KEYS_PATH)
const provider = new ethers.JsonRpcProvider(RPC);

const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)'
];

(async () => {
  const contract = new ethers.Contract(COLLECTION_ADDRESS, ERC721_ABI, provider);

  //set a success count to track successful balance fetches
  let successCount = 0;

  // Iterate through each wallet address and fetch the balance
  for (let i = 0; i < walletAdressList.length; i++) {
    const walletAddress = walletAdressList[i];
    try {
      const balance = await contract.balanceOf(walletAddress);
      console.log(`WALLET #${i + 1} ${walletAddress} \t BALANCE: ${balance.toString()}`);
      if (balance > 0) {
        successCount++;
      }
      //await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting

    } catch (error: any) {
      console.error(`Error fetching balance for ${walletAddress}:`, error.message);
      continue;
    }
  }

  console.log(`\nSUCCESS BALANCES ${successCount}/${walletAdressList.length}`);
})()