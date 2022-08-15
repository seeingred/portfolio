export type coinList = {
    id: string;
    symbol: string;
    name: string;
};
export type priceUsd = {
    usd: number;
}
export type prices = { 
    [key: string]: priceUsd;
}

export type token = {
    address: string
    chainId: number
    decimals: number
    logoURI: string
    name: string
    symbol: string
}

export type version = {
    major: number, minor: number, patch: number
}

export type tokensList = {
    keywords: string[]
    logoURI: string
    name: string
    timestamp: string
    tokens: token[]
    version: version[]
}