type tokenAmount = {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
};

export type solScanSolAmount = {
    account: string;
    executable: boolean;
    lamports: number;
    ownerProgram: string;
    rentEpoch: number;
    type: string;
};

export type solScanToken = {
    lamports: number;
    rentEpoch: number;
    tokenAccount: string;
    tokenAddress: string;
    tokenAmount: tokenAmount;
    tokenIcon: string;
    tokenName: string;
    tokenSymbol: string;
};
