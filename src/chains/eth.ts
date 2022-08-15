import {fetchAssets as fetchAssetsEnv} from '../evm';
import { StorageToken } from '../store/storage';
const apiRoot = 'https://mainnet.infura.io/v3/';
// apiKey https://infura.io/signup

export const fetchAssets = async (address: string, tokens: StorageToken[], apiKey?: string) => {
    return fetchAssetsEnv(address, tokens, apiKey || '', apiRoot, 1, 'eth')
}
