import { readFileSync } from "fs"
import { ethers } from 'ethers';

export const getPublicKeysFromLocalFile = (path: string) => readFileSync(path, 'utf-8')
  .split('\n')
  .map(addr => addr.trim())
  .filter((addr, index) => {
    if (!ethers.isAddress(addr)) {
      console.warn(`Invalid address found at line ${index + 1} in wallet list: ${addr}`);
      return false; // Exclude invalid addresses
    }
    return true; // Include valid addresses
  });


export const getPrivateKeysFromLocalFile = (path: string) => readFileSync(path, 'utf-8')
  .split('\n')
  .map(pk => pk.trim())
  .filter((pk, index) => {
    if (!ethers.isHexString(pk) || pk.length !== 66) {
      console.warn(`Invalid private key found at line ${index + 1} in private keys list`);
      return false; // Exclude invalid private keys
    }
    return true; // Include valid private keys
  });