import { Axios } from "../../libs/api"
import type { RestFulResponse } from "../../libs/response";
import type { ConfigResponse, LoginForm, LoginResponse, RegisterForm, RegisterResponse } from "../types/auth.type"

const api = Axios();

export const AuthModule = {
    async Login(data: LoginForm): Promise<RestFulResponse<LoginResponse>> {
        const response = await api.post("/auth/login", data);
        return response.data;
    },

    async Register(data: RegisterForm): Promise<RestFulResponse<RegisterResponse>> {
        const response = await api.post("/auth/register", data);
        return response.data;
    },

    async Config():Promise<RestFulResponse<ConfigResponse>> {
        const response = await api.get("/auth/config");
        return response.data;
    }
}