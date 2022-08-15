import { ApiPromise, WsProvider } from '@polkadot/api';
import { polkaDotAddressJson } from '../types/polkadotApi';
import type { coin } from '../types/local';
const baseUrl = 'wss://rpc.polkadot.io';


export const fetchAssets = async (address: string) => {
    const coins: coin[] = [];
    console.log(`2:  `, 2);
    // Construct
    const wsProvider = new WsProvider(baseUrl);
    console.log(`3:  `, 3);
    const api = await ApiPromise.create({ provider: wsProvider });
    console.log(`4:  `, 4);

    // Retrieve the account balance & nonce via the system module
    const resp = (await api.query.system.account(address)).toJSON() as polkaDotAddressJson;
    console.log(`resp:  `, resp);

    coins.push(
        {
            code: 'dot',
            amount: resp.data.free / 10000000000,
            price: 0,
            total: 0
        },
    );

    return coins;
};
export const fetchMultipleAddresses = false;
