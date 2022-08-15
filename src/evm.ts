import { keccak256 } from 'js-sha3';
import { evmJsonRpcAnswer, tokenConvert } from './types/evm';
import { fetchJson } from './fetchJson';
import type { coin } from './types/local';
import { StorageToken } from './store/storage';

export const fetchAssets = async (
    address: string,
    tokens: StorageToken[] = [],
    apiKey: string,
    apiRoot = 'https://mainnet.infura.io/v3/',
    chainId = 1,
    code = 'eth',
    tokenConvert: tokenConvert[] = []
) => {

    const coins: coin[] = [];

    const infuraProjectID = apiKey;

    for (const token of tokens) {
        // Hex encoding needs to start with 0x.
        // First comes the function selector, which is the first 4 bytes of the
        // keccak256 hash of the function signature.
        // ABI-encoded arguments follow. The address must be left-padded to 32 bytes.
        const data =
            '0x' +
            keccak256.hex('balanceOf(address)').substring(0, 8) +
            '000000000000000000000000' +
            address.substring(2); // chop off the 0x
        const resp: evmJsonRpcAnswer = await fetchJson(
            `${apiRoot}${infuraProjectID}`,
            {
                redirect: 'follow',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_call',
                    params: [
                        {
                            to: token.contract,
                            data: data
                        },
                        'latest'
                    ]
                })
            }
        );
        console.log(`resp:  `, resp);
        console.log(`token.decimal:  `, token.decimal);
        const coin: coin = {
            code: token.ticker,
            amount: parseInt(resp.result, 16) / Math.pow(10, token.decimal),
            price: 0,
            total: 0
        };
        console.log(`coin:  `, coin);
        const tokenToConvert = tokenConvert.find(t => t.code.toUpperCase() === coin.code.toUpperCase());
        if (tokenToConvert) {
            coin.code = tokenToConvert.toCode.toUpperCase();
            coin.amount = await tokenToConvert.convert(coin.amount);
        }
        coins.push(coin);
    }

    const respEth: evmJsonRpcAnswer = await fetchJson(
        `${apiRoot}${infuraProjectID}`,
        {
            redirect: 'follow',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [address, 'latest'],
                id: 2
            })
        }
    );

    const chainBalance = parseInt(respEth.result, 16) / Math.pow(10, 18);
    
    coins.push(
        {
            code,
            amount: chainBalance,
            price: 0,
            total: 0
        },
    );

    return coins;
};
export const fetchMultipleAddresses = false;
