import { ethers } from 'ethers';
export const generatePrivateKeys = async (numberOfKeys: number): Promise<string[]> => {
  const privateKeys: string[] = [];
  for (let i = 0; i < numberOfKeys; i++) {
    const wallet = ethers.Wallet.createRandom();
    privateKeys.push(wallet.privateKey);
  }
  return privateKeys;
}

(async function main() {
  const pkList = await generatePrivateKeys(2)
  console.log(`Generated Private Keys:\n${pkList.join('\n')}`);
})()