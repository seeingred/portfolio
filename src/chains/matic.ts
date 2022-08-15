import { fetchAssets as fetchAssetsEnv } from '../evm';
import { StorageToken } from '../store/storage';
const apiRoot = 'https://polygon-rpc.com/';

export const fetchAssets = async (address: string, tokens: StorageToken[], apiKey?: string) => {
    return fetchAssetsEnv(address, tokens, apiKey || '', apiRoot, 137, 'matic');
};
