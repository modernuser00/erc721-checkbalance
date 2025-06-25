import path from 'path';
import { readFileSync } from "fs"
import { ethers } from 'ethers';

const contractAddress = '0x63eb9d77D083cA10C304E28d5191321977fd0Bfb';

let walletTypePath = ""
const args = process.argv.slice(2);
if (args.includes('--og')) {
  walletTypePath = path.join(__dirname, '../wallets/og.txt');
} else if (args.includes('--wl')) {
  walletTypePath = path.join(__dirname, '../wallets/wl.txt');
} else {
  console.error("Please provide --og or --wl flag.");
  process.exit(1);
}

// load wallets
const walletAdressList = readFileSync(walletTypePath, 'utf-8').split('\n');


const provider = new ethers.JsonRpcProvider('https://rpc.hyperliquid.xyz/evm');

const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
];

(async () => {
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);

  for (let i = 0; i < walletAdressList.length; i++) {
    const walletAddress = walletAdressList[i];
    try {
      const balance = await contract.balanceOf(walletAddress);
      console.log(`WALLET #${i + 1} ${walletAddress}: ${balance.toString()}`);
      //await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting

    } catch (error: any) {
      console.error(`Error fetching balance for ${walletAddress}:`, error.message);
      continue;
    }
  }
})()