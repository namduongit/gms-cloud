export type CreateTokenForm = {
    name: string;
    time?: number | null;
}

export type TokenResponse = {
    uuid: string;
    name: string;
    token: string;
    public_token: string;
    private_token: string;
    expires_at: string | null;
}

export type TokenListResponse = {
    owner_uuid: string;
    tokens: TokenResponse[];
}