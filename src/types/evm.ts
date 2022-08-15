export type tokenConvert = {
    code: string
    toCode: string
    convert: (amount: number) => Promise<number>
}

export type evmJsonRpcAnswer = {
    id: number;
    jsonrpc: string;
    result: string;
};
