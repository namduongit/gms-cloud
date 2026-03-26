import { useContext } from "react"
import { NotificateContext } from "../contexts/notificate";

export const useNotificate = () => {
    const Notificate = useContext(NotificateContext);
    if (!Notificate) {
        throw new Error("Require NotificateProvider to use this hook");
    }

    return Notificate;
}