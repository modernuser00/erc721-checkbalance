import { ethers } from "ethers";
import { ERC20_CONTRACT_ADDRESS, PUBLIC_KEYS_PATH, RPC } from "../helpers/constants";
import { ERC20_ABI } from "./abi";
import { getPublicKeysFromLocalFile } from "../helpers";

const wallets = getPublicKeysFromLocalFile(PUBLIC_KEYS_PATH);
const provider = new ethers.JsonRpcProvider(RPC);

(async function main() {
  try {
    const erc20Contract = new ethers.Contract(ERC20_CONTRACT_ADDRESS, ERC20_ABI, provider);

    for (let i = 0; i < wallets.length; i++) {
      const wallet = wallets[i];
      const balance = await erc20Contract.balanceOf(wallet);
      const decimals = await erc20Contract.decimals();
      const displayBalance = ethers.formatUnits(balance, decimals);
      console.log(`Wallet #${i + 1}: ${wallet} BALANCE: ${displayBalance}`);
    }

  } catch (error) {
    console.error("Error fetching ERC20 balances:", error);
  }
})()