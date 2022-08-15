import { avaxJsonRpcAnswer } from '../types/avax';
import { fetchJson } from '../fetchJson';
import type { coin } from '../types/local';
const baseUrl = 'https://api.avax.network';

export const fetchAssets = async (address: string) => {
    const coins: coin[] = [];

    const resp: avaxJsonRpcAnswer = await fetchJson(`${baseUrl}/ext/bc/X`, {
        redirect: 'follow',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'avm.getAllBalances',
            params: {
                address: address
            }
        })
    });
    const balances = resp.result.balances;
    for (const balance of balances) {
        coins.push({
            code: balance.asset.toLowerCase(),
            amount: parseFloat(balance.balance) / 1000000000,
            price: 0,
            total: 0
        });
    }

    return coins;
};
export const fetchMultipleAddresses = false;
