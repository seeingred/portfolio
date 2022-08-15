type permissionsKeys = {
    address: string;
    weight: number;
};

type activePermissions = {
    id: number;
    keys: permissionsKeys[];
    length: number;
    operations: string;
    permission_name: string;
    threshold: number;
    type: string;
};

type tokenBalance = {
    amount: string;
    balance: string;
    tokenAbbr: string;
    tokenCanShow: number;
    tokenDecimal: number;
    tokenId: string;
    tokenLogo: string;
    tokenName: string;
    tokenPriceInTrx: number;
    tokenType: string;
    vip: boolean;
};

type bandwidthAsset = {
    netLimit: number;
    netPercentage: number;
    netRemaining: number;
    netUsed: number;
};

type bandwidthAssets = {
    [key: string]: bandwidthAsset;
};

type bandwidth = {
    assets: bandwidthAssets;
    netLimit: number;
    netPercentage: number;
    netRemaining: number;
    netUsed: number;
    energyLimit: number;
    energyPercentage: number;
    energyRemaining: number;
    energyUsed: number;
    freeNetLimit: number;
    freeNetPercentage: number;
    freeNetRemaining: number;
    freeNetUsed: number;
    storageLimit: number;
    storagePercentage: number;
    storageRemaining: number;
    storageUsed: number;
    totalEnergyLimit: number;
    totalEnergyWeight: number;
    totalNetLimit: number;
    totalNetWeight: number;
};

type frozenBalances = {
    expires: number;
    amount: number;
};

type frozen = {
    total: 100000000;
    balances: frozenBalances[];
};

type ownerPermission = {
    keys: permissionsKeys[];
    length: number;
    permission_name: string;
    threshold: number;
};

type representative = {
    lastWithDrawTime: number;
    allowance: number;
    enabled: boolean;
    url: string;
};

export type tronScanAddress = {
    accountResource: any;
    accountType: number;
    acquiredDelegateFrozenForBandWidth: number;
    acquiredDelegateFrozenForEnergy: number;
    activePermissions: activePermissions[];
    address: string;
    addressTagLogo: string;
    allowExchange: any[];
    balance: string;
    balances: tokenBalance[];
    bandwidth: bandwidth;
    date_created: number;
    delegateFrozenForBandWidth: number;
    delegateFrozenForEnergy: number;
    delegated: any;
    exchanges: any[];
    frozen: frozen;
    frozenForBandWidth: number;
    frozenForEnergy: number;
    frozen_supply: any[];
    name: string;
    ownerPermission: ownerPermission;
    representative: representative;
    reward: string;
    rewardNum: number;
    tokenBalances: tokenBalance[];
    tokens: tokenBalance[];
    totalFrozen: number;
    totalTransactionCount: number;
    transactions: number;
    transactions_in: number;
    transactions_out: number;
    trc20token_balances: tokenBalance[];
    trc721token_balances: any[];
    voteTotal: number;
    witness: number;
};
