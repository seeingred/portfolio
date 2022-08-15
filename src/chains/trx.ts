import { fetchJson } from '../fetchJson';
import type { tronScanAddress } from '../types/tronScan';
import type { coin } from '../types/local';
import { StorageToken } from '../store/storage';

export const fetchAssets = async (address: string, tokens: StorageToken[]) => {
    const data: tronScanAddress = await fetchJson(
        `https://apilist.tronscan.org/api/account?address=${address}`
    );
    const coins: coin[] = [];
    for (const token of tokens) {
        const foundToken = data.tokens.find(t => t.tokenAbbr.toUpperCase() === token.ticker.toUpperCase());
        if (!foundToken) {
            continue;
        }
        let amount = parseFloat(foundToken.balance) / Math.pow(10, token.decimal);
        coins.push({
            code: token.ticker.toUpperCase(),
            amount,
            price: 0,
            total: 0
        });
    }
    const existingTrx = data.tokens.find((t) => t.tokenAbbr.toUpperCase() === 'TRX');
    if (!existingTrx) {
        return coins;
    }
    const trx = {
        code: 'TRX',
        amount: parseFloat(existingTrx.balance) / Math.pow(10, existingTrx.tokenDecimal),
        price: 0,
        total: 0
    }
    trx.amount += data.totalFrozen / Math.pow(10, 6); // adding staking amount
    trx.amount += data.rewardNum / Math.pow(10, 6); // adding rewards amount
    coins.push(trx);
    return coins;
};