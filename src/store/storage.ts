import { apiKey } from './../types/local';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk, ActionWithPayload } from '.';
import Settings from '../routes/Settings';

export type StorageToken = {
    ticker: string;
    contract: string;
    decimal: number;
    comment: string;
};

export type StorageAddress = {
    value: string;
    comment: string;
};

export type StorageCrypto = {
    chain: string;
    addresses: StorageAddress[];
    tokens: StorageToken[];
    apiKey?: string;
    extraFunds?: number;
};

export type StorageState = {
    cryptos: StorageCrypto[];
};

export type asset = {
    chain: string;
    address: string;
    comment: string;
    apiKey?: string;
};

export type Settings = { chain: string; apiKey: string; extraFunds: number };

function getInitialState(): StorageState {
    let cryptos: StorageCrypto[] = [];
    try {
        cryptos = JSON.parse(localStorage.getItem('addresses') || '[]');
    } catch {}
    return { cryptos };
}

export const storageSlice = createSlice({
    name: 'storage',
    initialState: getInitialState(),
    reducers: {
        addCrypto: (state, action: PayloadAction<asset>) => {
            state.cryptos.push({
                chain: action.payload.chain,
                addresses: [
                    {
                        value: action.payload.address,
                        comment: action.payload.comment
                    }
                ],
                tokens: [],
                apiKey: action.payload.apiKey
            });
        },
        removeCryptos: (state, action: PayloadAction<string[]>) => {
            const cryptos = action.payload;
            for (const crypto of cryptos) {
                const cryptoIndex = state.cryptos.findIndex(
                    (c) => c.chain === crypto
                );
                state.cryptos.splice(cryptoIndex, 1);
            }
        },
        removeAddresses: (
            state,
            action: PayloadAction<{ chain: string; addresses: string[] }>
        ) => {
            const addresses = action.payload.addresses;
            const chain = action.payload.chain;
            const crypto = state.cryptos.find((c) => c.chain === chain);
            if (!crypto) {
                return;
            }
            for (const address of addresses) {
                const addrIndex = crypto.addresses.findIndex(
                    (a) => a.value === address
                );
                crypto.addresses.splice(addrIndex, 1);
            }
        },
        addAddress: (state, action: PayloadAction<asset>) => {
            const crypto = state.cryptos.find(
                (c) => c.chain === action.payload.chain
            );
            crypto?.addresses.push({
                value: action.payload.address,
                comment: action.payload.comment
            });
        },
        modifyAddress: (state, action: PayloadAction<asset>) => {
            const crypto = state.cryptos.find(
                (c) => c.chain === action.payload.chain
            );
            if (!crypto) {
                return;
            }
            let address = crypto.addresses.find(
                (a) => a.value === action.payload.address
            );
            if (!address) {
                return;
                // crypto?.addresses.push({value: action.payload.address, comment: action.payload.comment});
            } else {
                address.comment = action.payload.comment;
                address.value = action.payload.address;
            }
        },

        addToken: (
            state,
            action: PayloadAction<{ chain: string; token: StorageToken }>
        ) => {
            const crypto = state.cryptos.find(
                (c) => c.chain === action.payload.chain
            );
            crypto?.tokens.push(action.payload.token);
        },
        modifyToken: (
            state,
            action: PayloadAction<{ chain: string; token: StorageToken }>
        ) => {
            const crypto = state.cryptos.find(
                (c) => c.chain === action.payload.chain
            );
            if (!crypto) {
                return;
            }
            let token = crypto.tokens.find(
                (t) => t.ticker === action.payload.token.ticker
            );
            if (!token) {
                return;
            } else {
                token.contract = action.payload.token.contract;
                token.decimal = action.payload.token.decimal;
                token.comment = action.payload.token.comment;
            }
        },
        removeTokens: (
            state,
            action: PayloadAction<{ chain: string; tickers: string[] }>
        ) => {
            const tickers = action.payload.tickers;
            const chain = action.payload.chain;
            const crypto = state.cryptos.find((c) => c.chain === chain);
            if (!crypto) {
                return;
            }
            for (const ticker of tickers) {
                const tokenIndex = crypto.tokens.findIndex(
                    (a) => a.ticker === ticker
                );
                crypto.tokens.splice(tokenIndex, 1);
            }
        },
        saveSettings: (
            state,
            action: PayloadAction<Settings>
        ) => {
            const crypto = state.cryptos.find(
                (c) => c.chain === action.payload.chain
            );
            if (!crypto) {
                state.cryptos.push({
                    chain: action.payload.chain,
                    addresses: [],
                    tokens: [],
                    apiKey: action.payload.apiKey,
                    extraFunds: action.payload.extraFunds
                })
                return;
            }
            crypto.apiKey = action.payload.apiKey;
            crypto.extraFunds = action.payload.extraFunds;
        }
    }
});

function saveStorage(storage: StorageCrypto[]) {
    localStorage.setItem('addresses', JSON.stringify(storage));
}

export const {
    removeTokens,
    addToken,
    modifyToken,
    addCrypto,
    addAddress,
    removeCryptos,
    removeAddresses,
    modifyAddress,
    saveSettings
} = storageSlice.actions;

export const addAssetOrAddressAddModify =
    (asset: asset): AppThunk =>
    (dispatch, getState) => {
        asset.chain = asset.chain.toLowerCase();
        const cryptos = getState().storage.cryptos;
        const crypto = cryptos.find((c) => c.chain === asset.chain);
        if (!crypto) {
            dispatch(addCrypto(asset));
        } else {
            const address = crypto.addresses.find(
                (a) => a.value === asset.address
            );
            if (!address) {
                dispatch(addAddress(asset));
            } else {
                dispatch(modifyAddress(asset));
            }
        }
        saveStorage(getState().storage.cryptos);
    };

export const removeAssets =
    (cryptos: string[]): AppThunk =>
    (dispatch, getState) => {
        dispatch(removeCryptos(cryptos));
        saveStorage(getState().storage.cryptos);
    };

export const removeAddressesOrAsset =
    (chain: string, addresses: string[]): AppThunk =>
    (dispatch, getState) => {
        dispatch(removeAddresses({ chain, addresses }));
        const cryptos = getState().storage.cryptos;
        const crypto = cryptos.find((c) => c.chain === chain);
        if (!crypto) {
            saveStorage(cryptos);
            return;
        }
        if (!crypto.addresses.length) {
            dispatch(removeCryptos([chain]));
        }
        saveStorage(getState().storage.cryptos);
    };

export const removeTokensThunk =
    (chain: string, tickers: string[]): AppThunk =>
    (dispatch, getState) => {
        dispatch(removeTokens({ chain, tickers }));
        saveStorage(getState().storage.cryptos);
    };

export const addOrModifyToken =
    (chain: string, token: StorageToken): AppThunk =>
    (dispatch, getState) => {
        const cryptos = getState().storage.cryptos;
        const crypto = cryptos.find((c) => c.chain === chain);
        if (!crypto) {
            return;
        } else {
            const existingToken = crypto.tokens.find(
                (t) => t.ticker === token.ticker
            );
            if (!existingToken) {
                dispatch(
                    addToken({
                        chain,
                        token
                    })
                );
            } else {
                dispatch(
                    modifyToken({
                        chain,
                        token
                    })
                );
            }
        }
        saveStorage(getState().storage.cryptos);
    };

export const saveSettingsThunk =
    (settings: Settings): AppThunk =>
    (dispatch, getState) => {
        settings.chain = settings.chain.toLowerCase();
        dispatch(saveSettings(settings));
        saveStorage(getState().storage.cryptos);
    };

//

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default storageSlice.reducer;
