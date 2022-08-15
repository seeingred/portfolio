type address = {
    address: string;
    final_balance: number;
    n_tx: number;
    total_received: number;
    total_sent: number;
};

type latestBlock = {
    block_index: number;
    hash: string;
    height: number;
    time: number;
};

type symbolBtc = {
    code: string;
    conversion: number;
    local: boolean;
    name: string;
    symbol: string;
    symbolAppearsAfter: boolean;
};

type symbolLocal = {
    code: string;
    conversion: number;
    local: true;
    name: string;
    symbol: string;
    symbolAppearsAfter: boolean;
};

type info = {
    conversion: number;
    latest_block: latestBlock;
    nconnected: number;
    symbol_btc: symbolBtc;
    symbol_local: symbolLocal;
};

type spendingOutpoints = {
    n: number;
    tx_index: number;
};

type output = {
    addr: string;
    n: 1;
    script: string;
    spending_outpoints: spendingOutpoints[];
    spent: boolean;
    tx_index: number;
    type: number;
    value: number;
};

type input = {
    index: 0;
    prev_out: output;
    script: string;
    sequence: number;
    witness: string;
};

type tx = {
    balance: number;
    block_height: number;
    block_index: number;
    double_spend: boolean;
    fee: number;
    hash: string;
    inputs: input[];
    lock_time: number;
    out: output[];
    relayed_by: string;
    result: number;
    size: number;
    time: number;
    tx_index: number;
    ver: number;
    vin_sz: number;
    vout_sz: number;
    weight: number;
};

export type blockChainBalances = {
    addresses: address[];
    info: info;
    recommend_include_fee: boolean;
    txs: tx[];
    wallet: address;
};
