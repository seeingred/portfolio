import { fetchJson } from '../fetchJson';
import type { coin } from '../types/local';
import type { solScanToken, solScanSolAmount } from '../types/solScan';
import { StorageToken } from '../store/storage';
const apiRoot = 'https://public-api.solscan.io/';
export const fetchAssets = async (address: string, tokens: StorageToken[]) => {
    let tokensFetched: solScanToken[];
    try {
        tokensFetched = await fetchJson(
            `${apiRoot}account/tokens?account=${address}`
        );
    } catch (e) {
        tokensFetched = [];
    }
    let stakes: any[];
    try {
        stakes = await fetchJson(
            `${apiRoot}account/stakeAccounts?account=${address}`
        );
    } catch (e) {
        stakes = [];
    }
    let sol: solScanSolAmount;
    try {
        sol = await fetchJson(`${apiRoot}account/${address}`);
    } catch (e) {
        sol = {
            account: '',
            executable: false,
            lamports: 0,
            ownerProgram: '',
            rentEpoch: 0,
            type: ''
        };
    }
    const coins: coin[] = [];
    coins.push({
        code: 'sol',
        amount: sol.lamports / 1000000000,
        price: 0,
        total: 0
    });
    for (const s in stakes) {
        // staking amount (not tested)
        const stake = stakes[s];
        const soll = coins.find((c) => c.code === 'sol');
        if (!soll) {
            continue;
        }
        soll.amount += stake.amount / 1000000000;
    }
    for (const token of tokens) {
        const existingToken = tokensFetched.find(
            (t) => t.tokenAddress === token.contract
        );
        if (!existingToken) {
            continue;
        }
        coins.push({
            code: token.ticker.toUpperCase(),
            amount: existingToken.tokenAmount.uiAmount,
            price: 0,
            total: 0
        });
    }
    return coins;
};
