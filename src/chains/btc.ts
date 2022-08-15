import { fetchJson } from '../fetchJson';
import type { blockChainBalances } from '../types/blockChain';
import type { omniExplorerBalances } from '../types/omniExplorer';
import { StorageToken } from '../store/storage';
const omniApiRoot = 'https://api.omniexplorer.info/';
const blockchainApiRoot = 'https://blockchain.info/';

export const fetchAssets = async (addresses: string[], tokens: StorageToken[]) => {
    let coins = [
        {
            code: 'btc',
            amount: 0
        }
    ];
    let bech32Addresses = addresses.filter((address) => {
        if (address.startsWith('bc1')) {
            return true;
        }
    });
    let addressesLegacy = addresses.filter((address) => {
        if (!address.startsWith('bc1')) {
            return true;
        }
    });
    if (addressesLegacy.length) {
        const addressesParam = 'addr=' + addressesLegacy.join('&addr=');

        const balances: omniExplorerBalances = await fetchJson(
            `${omniApiRoot}v2/address/addr/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: addressesParam
            }
        );

        for (const addr in balances) {
            const coinsBalance = balances[addr].balance;
            for (const token of tokens) {
                const balance = coinsBalance.find(c => token.contract === c.id);
                if (!balance) {
                    return;
                }
                const currency = balance.propertyinfo;
                const existingCoin = coins.find((c) => c.code === token.ticker);
                if (existingCoin) {
                    existingCoin.amount +=
                        parseFloat(balance.value) / token.decimal;
                } else {
                    coins.push({
                        code: token.ticker,
                        amount: parseFloat(balance.value) / token.decimal
                    });
                }
            }
        }
    }

    if (bech32Addresses.length) {
        const balances: blockChainBalances = await fetchJson(
            `${blockchainApiRoot}multiaddr?active=${bech32Addresses.join('|')}`
        );
        const btc = coins[0];
        for (const balance of balances.addresses) {
            btc.amount += balance.final_balance / 100000000;
        }
    }
    // todo: add support for xpub ypub and zup address import
    // from ledger: copy xpub
    // convert it to zpub: https://jlopp.github.io/xpub-converter/
    // import it to electrum (default wallet -? using master key)

    return coins;
};
export const fetchMultipleAddresses = true;
