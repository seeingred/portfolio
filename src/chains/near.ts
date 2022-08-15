import { nearJsonRpcAnswer } from '../types/near';
import { fetchJson } from '../fetchJson';
import type { coin } from '../types/local';
const baseUrl = 'https://rpc.mainnet.near.org';

export const fetchAssets = async (address: string) => {
    const coins: coin[] = [];

    const resp: nearJsonRpcAnswer = await fetchJson(`${baseUrl}`, {
        redirect: 'follow',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'query',
            params: {
                request_type: 'view_account',
                finality: 'final',
                account_id: address
            }
        })
    });

    let amount: number;
    try {
        amount = parseFloat(resp.result.amount) / 1e24;
    } catch (e) {
        return coins;
    }
    
    coins.push({
        code: 'near',
        amount: amount,
        price: 0,
        total: 0
    });

    return coins;
};
export const fetchMultipleAddresses = false;
