import { fetchAssets as fetchAssetsEnv } from '../evm';
import { evmJsonRpcAnswer, tokenConvert } from '../types/evm';
import { fetchJson } from '../fetchJson';
import { StorageToken } from '../store/storage';
const apiRoot = 'https://rpc.coinex.net/';

export const fetchAssets = async (address: string, tokens: StorageToken[], apiKey?: string) => {
    // const tokens = [
    //     {
    //         code: 'icet',
    //         contract: '0x8EC3F54fF92e050ed339F3eE256d0AF6f7fE9Bd1'
    //     }
    // ];
    const tokenConvert: tokenConvert[] = [
        {
            code: 'icet',
            toCode: 'cet',
            convert: async (amount: number) => {
                const rateResp: evmJsonRpcAnswer = await fetchJson(apiRoot, {
                    redirect: 'follow',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        id: 9,
                        method: 'eth_call',
                        params: [
                            {
                                data: '0xc7faf09f',
                                to: '0xf37530504c86e3d1c22901887224aefffee33452'
                            },
                            'latest'
                        ]
                    })
                });
                const rate = parseInt(rateResp.result, 16) / Math.pow(10, 9);
                return rate * amount;
            }
        }
    ];
    return fetchAssetsEnv(
        address,
        tokens,
        apiKey || '',
        apiRoot,
        52,
        'cet',
        tokenConvert
    );
};
