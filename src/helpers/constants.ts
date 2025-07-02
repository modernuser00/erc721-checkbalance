import path from 'path';
import config from '../../config.json';

//RPC configuration
export const RPC = config.rpc[0].trim();
export const RPC_LIST = config.rpc.map((url: string) => url.trim()).filter((url: string) => url !== '');

// ERC721 configuration
export const COLLECTION_ADDRESS = config.erc721.collectionAddress.trim();
export const RECIPIENT_ADDRESS = config.erc721.recipientAddress.trim();

// ERC20 configuration
export const ERC20_CONTRACT_ADDRESS = config.erc20.contractAddress.trim();
export const ERC20_RECIPIENT_ADDRESS = config.erc20.recipientAddress.trim();

export const DATA_PATH = path.join(__dirname, '../../data');
export const PUBLIC_KEYS_PATH = path.join(DATA_PATH, 'public_keys.txt');
export const PRIVATE_KEYS_PATH = path.join(DATA_PATH, 'private_keys.txt');
export const OWNERS_PATH = path.join(DATA_PATH, 'holders.json');