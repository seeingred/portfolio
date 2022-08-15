import { fetchAssets as fetchAssetsEnv } from '../evm';
import { StorageToken } from '../store/storage';
const apiRoot = 'https://bsc-dataseed.binance.org/';


export const fetchAssets = async (address: string, tokens: StorageToken[], apiKey?: string) => {
    return fetchAssetsEnv(address, tokens, apiKey || '', apiRoot, 56, 'bnb');
};


