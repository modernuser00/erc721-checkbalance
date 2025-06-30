import path from 'path';
import config from '../../config.json';

export const COLLECTION_ADDRESS = config.collectionAddress.trim();
export const RECIPIENT_ADDRESS = config.recipientAddress.trim();
export const RPC = config.rpc[0].trim();
export const RPC_LIST = config.rpc.map((url: string) => url.trim()).filter((url: string) => url !== '');

export const DATA_PATH = path.join(__dirname, '../../data');
export const PUBLIC_KEYS_PATH = path.join(DATA_PATH, 'public_keys.txt');
export const PRIVATE_KEYS_PATH = path.join(DATA_PATH, 'private_keys.txt');
export const OWNERS_PATH = path.join(DATA_PATH, 'holders.json');