export type apiKey = {
    chain: string;
    key: string;
}

export type coin = {
    code: string;
    amount: number;
    price: number;
    total: number;    
};

export type mapsType = { 
    [key: string]: string;
}

export type chainInfo = {
    fullName: () => string;
    contractFieldLabel?: () => string;
    addressTrim: number
}

export type chainInfos = {[key: string]: chainInfo};