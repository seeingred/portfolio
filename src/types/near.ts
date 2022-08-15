type result = {
    amount: string;
    locked: string;
    code_hash: string;
    storage_usage: number;
    storage_paid_at: number;
    block_height: number;
    block_hash: string;
};

export type nearJsonRpcAnswer = {
    jsonrpc: string;
    result: result;
    id: number | string;
};
