
import { ethers } from 'ethers';
import { getPrivateKeysFromLocalFile } from './helpers';
import { COLLECTION_ADDRESS, PRIVATE_KEYS_PATH, RECIPIENT_ADDRESS, RPC } from './helpers/constants';
import { fetchERC721CollectionHolders, getTokenIdsByOwner } from './helpers/ERC721Holders';

// config
const contractAddress = COLLECTION_ADDRESS
const pkList = getPrivateKeysFromLocalFile(PRIVATE_KEYS_PATH);
const provider = new ethers.JsonRpcProvider(RPC);


const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function ownerOf(uint256 tokenId) view returns (address)',
];


(async () => {
  // get collectons owners
  if (process.argv.includes('--update')) {
    await fetchERC721CollectionHolders();
  }
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);

  //set a success count to track successful balance fetches
  let successCount = 0;

  // Get wallet addresses from private keys
  const walletAdressList = pkList.map(pk => {
    const wallet = new ethers.Wallet(pk, provider);
    return wallet.address;
  });

  // Iterate through each wallet address and fetch the balance
  for (let i = 0; i < walletAdressList.length; i++) {
    const walletAddress = walletAdressList[i];
    try {
      const balance = await contract.balanceOf(walletAddress);
      console.log(`WALLET #${i + 1} ${walletAddress} \t BALANCE: ${balance.toString()}`);
      if (balance > 0) {
        successCount++;
        const tokenIds = getTokenIdsByOwner(walletAddress)
        console.log(`Token IDs for ${walletAddress}:`, tokenIds);
        // Transfer each token to the recipient
        const wallet = new ethers.Wallet(pkList[i], provider);
        const contractWithSigner = contract.connect(wallet);

        for (const tokenId of tokenIds) {
          try {
            const tx = await (contractWithSigner as any).safeTransferFrom(walletAddress, RECIPIENT_ADDRESS, tokenId);
            console.log(`✅Transferred token ${tokenId} from ${walletAddress} to ${RECIPIENT_ADDRESS}.\nTx: https://hyperscan.com/tx/${tx.hash}`);
            await tx.wait();
          } catch (transferError: any) {
            console.error(`❌Error transferring token ${tokenId} from ${walletAddress}:`, transferError.message);
          }
        }

      }
    } catch (error: any) {
      console.error(`Error fetching balance for ${walletAddress}:`, error.message);
      continue;
    }
  }

  console.log(`\nSUCCESS BALANCES ${successCount}/${walletAdressList.length}`);
})()
