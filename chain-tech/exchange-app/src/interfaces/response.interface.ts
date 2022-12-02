interface ExchangeResponse<T> {
    code: string,
    msg: string
    data: T
}

interface WebSocketResponse<T> {
    channel: string;
    data: T;
}