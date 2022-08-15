type balance = {
    asset: string;
    balance: string;
};

type balancesResult = {
    balances: balance[];
};

export type avaxJsonRpcAnswer = {
    jsonrpc: string;
    result: balancesResult;
    id: 1;
};
