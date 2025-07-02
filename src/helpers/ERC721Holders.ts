import fs from 'fs';
import { ethers } from 'ethers';
import { COLLECTION_ADDRESS, OWNERS_PATH, RPC_LIST } from './constants';
import config from '../../config.json';

// providers
const providers = RPC_LIST.map(url => new ethers.JsonRpcProvider(url));

const ERC721_ABI = [
  'function ownerOf(uint256) view returns (address)'

];
const START_TOKEN_ID = config.erc721.collectionStartTokenId || 0
const END_TOKEN_ID = config.erc721.collectionEndTokenId || 100;
const BATCH_SIZE = config.erc721.batchSize || 2;

export const fetchERC721CollectionHolders = async () => {
  console.log(`Fetching ERC721 collection holders from token ID ${START_TOKEN_ID} to ${END_TOKEN_ID} in batches of ${BATCH_SIZE}...`);
  const contracts = providers.map(provider => new ethers.Contract(COLLECTION_ADDRESS, ERC721_ABI, provider));
  let successCount = 0;
  const owners: { tokenId: number; owner: string }[] = [];

  for (let tokenId = START_TOKEN_ID; tokenId <= END_TOKEN_ID; tokenId += BATCH_SIZE) {
    const batchPromises = [];
    for (let i = 0; i < BATCH_SIZE && (tokenId + i) <= END_TOKEN_ID; i++) {
      const currentTokenId = tokenId + i;
      batchPromises.push(
        contracts[0].ownerOf(currentTokenId)
          .then(owner => ({ tokenId: currentTokenId, owner }))
          .catch(error => {
            console.error(`Error fetching owner for token ID ${currentTokenId}:`, error.message);
            return { tokenId: currentTokenId, owner: "null" };
          })
      );
    }

    const batchResults = await Promise.all(batchPromises);
    for (const result of batchResults) {
      owners.push(result);
      if (result.owner !== ethers.ZeroAddress && result.owner !== "null") {
        successCount++;
      }
    }
  }

  fs.writeFileSync(OWNERS_PATH, JSON.stringify(owners, null, 2), 'utf-8');
  console.log(`Saved owners to ${OWNERS_PATH}`);
}

export const getERC721CollectionHoldersFromFile = () => {
  if (!fs.existsSync(OWNERS_PATH)) {
    console.error(`Owners file not found at ${OWNERS_PATH}`);
    return [];
  }
  const data = fs.readFileSync(OWNERS_PATH, 'utf-8');
  return JSON.parse(data);
}

export const getTokenIdsByOwner = (walletAddress: string): number[] => {
  const owners = getERC721CollectionHoldersFromFile();
  if (!walletAddress) return [];
  return owners
    .filter((entry: { tokenId: number; owner: string }) => entry.owner.toLowerCase() === walletAddress.toLowerCase())
    .map((entry: { tokenId: number }) => entry.tokenId);
}

