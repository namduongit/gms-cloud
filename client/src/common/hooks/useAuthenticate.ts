import { useContext } from "react"
import { AuthenticateContext } from "../contexts/authenticate";

export const useAuthenticate = () => {
    const Authenticate = useContext(AuthenticateContext);
    if (!Authenticate) {
        throw new Error("Require AuthenticateProvider to use this hook");
    }

    return Authenticate;
}