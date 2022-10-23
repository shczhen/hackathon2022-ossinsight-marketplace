export class APIError extends Error {
    constructor(readonly code: number, readonly  message: string) {
        super(message);
    }
}

export interface ErrorResult {
    message: string;
}