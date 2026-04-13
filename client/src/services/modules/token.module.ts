import { Axios } from "../../libs/api";
import type { RestResponse } from "../../libs/response";
import type { CreateTokenForm } from "../types/token.type";
import type { TokenListResponse, TokenResponse } from "../types/token.type";

const api = Axios();

export const TokenModule = {
    async GetToken() {
        const response = await api.get<RestResponse<TokenListResponse>>("/api/guard/tokens");
        return response.data;
    },

    async CreateToken(data: CreateTokenForm) {
        const response = await api.post<RestResponse<TokenResponse>>("/api/guard/tokens", data);
        return response.data;
    },

    async DeleteToken(uuid: string) {
        const response = await api.delete<RestResponse<null>>(`/api/guard/tokens/${uuid}`);
        return response.data;
    }
}