import { createContext, useEffect, useState } from "react";

type ToastOptions = {
    type: "info" | "success" | "warning" | "error";
    title: string;
    message: string;
}

type Toast = {
    id: string;
    options: ToastOptions;
    expiresAt: number;
}

const TOAST_DURATION = 4000;

const toastPalette: Record<ToastOptions["type"], { accent: string; muted: string; iconBg: string }> = {
    info: { accent: "#274c77", muted: "#f2f5f9", iconBg: "#d7e3f4" },
    success: { accent: "#365c2f", muted: "#edf3e7", iconBg: "#cfe3c4" },
    warning: { accent: "#7c5c1e", muted: "#f7f1e3", iconBg: "#f0e0be" },
    error: { accent: "#7a2f2f", muted: "#f8e9e7", iconBg: "#f1c8c3" },
};

const getToastIcon = (type: ToastOptions["type"]) => {
    switch (type) {
        case "info":
            return <i className="fa-regular fa-circle-question"></i>;
        case "success":
            return <i className="fa-regular fa-square-check"></i>;
        case "warning":
            return <i className="fa-solid fa-triangle-exclamation"></i>;
        case "error":
            return <i className="fa-solid fa-square-xmark"></i>;
        default:
            return "";
    }
}

interface NotificateContextType {
    showToast: (toast: ToastOptions) => void;
    showAlert: () => void;
    showConfirm: () => void;
}

const NotificateContext = createContext<NotificateContextType | undefined>(undefined);

const NotificateProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = window.setInterval(() => setNow(Date.now()), 75);
        return () => window.clearInterval(interval);
    }, []);

    const showToast = (toast: ToastOptions) => {
        const id = Date.now().toString();
        const expiresAt = Date.now() + TOAST_DURATION;
        setToasts((prev) => [...prev, { id, options: toast, expiresAt }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, TOAST_DURATION);
    };

    const showAlert = () => {

    }

    const showConfirm = () => {

    }

    /** Init value to test */
    useEffect(() => {
        // showToast({ type: "success", title: "Thành công", message: "Đăng nhập thành công!" });
    }, []);

    return (
        <NotificateContext.Provider value={{ showToast, showAlert, showConfirm }}>
            {/* Toast positions */}
            <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3">
                {toasts.map((toast) => {
                    const { accent, muted, iconBg } = toastPalette[toast.options.type];
                    const remaining = Math.max(0, toast.expiresAt - now);
                    const progress = remaining / TOAST_DURATION;
                    const width = `${progress * 100}%`;

                    return (
                        <article
                            key={toast.id}
                            className="flex gap-3 rounded-2xl border border-[#d8d2c2] bg-white/95 p-4 shadow-md"
                            style={{ boxShadow: "0 24px 50px rgba(30, 27, 22, 0.18)" }}
                            aria-live="assertive"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl text-lg" style={{ color: accent, backgroundColor: iconBg }}>
                                {getToastIcon(toast.options.type)}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-[#1f1d19]">{toast.options.title}</p>
                                <p className="text-sm text-[#565249]">{toast.options.message}</p>
                                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: muted }}>
                                    <span
                                        className="block h-full rounded-full transition-[width] duration-75 ease-linear"
                                        style={{ width, backgroundColor: accent }}
                                    />
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {children}
        </NotificateContext.Provider>
    );
}

export { NotificateContext };

export default NotificateProvider;