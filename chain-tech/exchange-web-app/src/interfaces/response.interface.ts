export interface ExchangeResponse<T> {
    code: string,
    msg: string
    data: T
}

export interface WebSocketResponse<T> {
    channel: string;
    data: T;
}