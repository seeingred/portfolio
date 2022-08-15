type propertyInfo = {
    amount: string;
    block: number;
    blockhash: string;
    blocktime: number;
    category: string;
    confirmations: number;
    creationtxid: string;
    data: string;
    divisible: true;
    ecosystem: string;
    fee: string;
    fixedissuance: boolean;
    flags: any;
    freezingenabled: boolean;
    ismine: boolean;
    issuer: string;
    managedissuance: boolean;
    name: string;
    positioninblock: number;
    propertyid: number;
    propertyname: string;
    propertytype: string;
    rdata: null;
    registered: boolean;
    sendingaddress: string;
    subcategory: string;
    totaltokens: string;
    txid: string;
    type: string;
    type_int: number;
    url: string;
    valid: boolean;
    version: number;
};

type balance = {
    divisible: boolean;
    frozen: string;
    id: string;
    pendingneg: string;
    pendingpos: string;
    propertyinfo: propertyInfo;
    reserved: string;
    symbol: string;
    value: string;
};

type balanceWrapper = {
    balance: balance[];
};

export type omniExplorerBalances = {
    [key: string]: balanceWrapper;
};
