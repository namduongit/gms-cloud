import type { AxiosInstance } from "axios";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export function Axios(): AxiosInstance {
    /**
     * baseURL: Requests will map to baseUrl.
     * withCredentials: allows cookies to be sent and received.
     */
    const config = axios.create({
        baseURL: SERVER_URL,
        withCredentials: true,
    });

    /**
     * Token will send in cookies.
     * LocalStorage is not used to store any token
     * 
     */

    return config;
}