import { type FormEvent, useMemo, useState } from "react";
import { useNotificate } from "../../common/hooks/useNotificate";
import Button from "../../components/ui/button/button";

type TokenStatus = "active" | "revoked";

type TokenExpireOption = "never" | "1h" | "1d" | "7d" | "30d";

type ApiToken = {
    id: string;
    token: string;
    note: string;
    status: TokenStatus;
    created_at: string;
    expires_at?: string | null;
};

const STORAGE_KEY = "GO_API_TOKENS";

const formatDateTime = (isoValue: string) => {
    const date = new Date(isoValue);
    if (Number.isNaN(date.getTime())) {
        return "--";
    }

    return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const createTokenValue = () => {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);

    const hex = Array.from(bytes)
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("");

    return `gms_${hex}`;
};

const readTokenStorage = (): ApiToken[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw) as ApiToken[];
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed;
    } catch {
        return [];
    }
};

const saveTokenStorage = (items: ApiToken[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const getExpiresAtFromOption = (option: TokenExpireOption) => {
    if (option === "never") {
        return null;
    }

    const now = Date.now();
    const delta = {
        "1h": 60 * 60 * 1000,
        "1d": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
    }[option];

    return new Date(now + delta).toISOString();
};

const isTokenExpired = (token: ApiToken) => {
    if (!token.expires_at) {
        return false;
    }

    return new Date(token.expires_at).getTime() <= Date.now();
};

const AccountApiPage = () => {
    const notificate = useNotificate();
    const [note, setNote] = useState<string>("");
    const [tokens, setTokens] = useState<ApiToken[]>(() => readTokenStorage());
    const [expireOption, setExpireOption] = useState<TokenExpireOption>("7d");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const tokenCountLabel = useMemo(() => {
        if (tokens.length === 0) {
            return "Chưa có token nào";
        }

        if (tokens.length === 1) {
            return "1 token";
        }

        return `${tokens.length} token`;
    }, [tokens.length]);

    const handleCreateToken = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmed = note.trim();
        if (!trimmed) {
            notificate.showToast({
                type: "warning",
                title: "Thiếu ghi chú",
                message: "Vui lòng nhập ghi chú để dễ quản lý token."
            });
            return;
        }

        const newToken: ApiToken = {
            id: crypto.randomUUID?.() ?? `${Date.now()}`,
            token: createTokenValue(),
            note: trimmed,
            status: "active",
            created_at: new Date().toISOString(),
            expires_at: getExpiresAtFromOption(expireOption)
        };

        const nextTokens = [newToken, ...tokens];
        setTokens(nextTokens);
        saveTokenStorage(nextTokens);
        setNote("");
        setExpireOption("7d");

        notificate.showToast({
            type: "success",
            title: "Tạo token thành công",
            message: "Token mới đã được thêm vào danh sách."
        });
    };

    const handleCopyToken = async (token: string) => {
        try {
            await navigator.clipboard.writeText(token);
            notificate.showToast({
                type: "success",
                title: "Đã copy token",
                message: "Token đã được sao chép vào clipboard."
            });
        } catch {
            notificate.showToast({
                type: "error",
                title: "Không thể copy",
                message: "Trình duyệt không cho phép copy tự động."
            });
        }
    };

    const handleDeleteToken = (id: string) => {
        const nextTokens = tokens.filter((item) => item.id !== id);
        setTokens(nextTokens);
        saveTokenStorage(nextTokens);
        notificate.showToast({
            type: "info",
            title: "Đã xóa token",
            message: "Token đã được gỡ khỏi danh sách."
        });
    };

    const handleChangePassword = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            notificate.showToast({
                type: "warning",
                title: "Thiếu thông tin",
                message: "Vui lòng nhập đầy đủ các trường mật khẩu."
            });
            return;
        }

        if (newPassword.length < 8) {
            notificate.showToast({
                type: "warning",
                title: "Mật khẩu quá ngắn",
                message: "Mật khẩu mới cần ít nhất 8 ký tự."
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            notificate.showToast({
                type: "error",
                title: "Không khớp mật khẩu",
                message: "Xác nhận mật khẩu mới chưa khớp."
            });
            return;
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        notificate.showToast({
            type: "info",
            title: "Chưa có API đổi mật khẩu",
            message: "Phần UI đã sẵn sàng, chờ backend để kết nối thao tác đổi mật khẩu."
        });
    };

    return (
        <div className="space-y-4">
            <header className="p-2 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">API & Bảo mật</h1>
                    <span className="mt-1 block text-sm text-gray-500">Quản lý token truy cập và đổi mật khẩu tài khoản.</span>
                </div>
            </header>

            <section className="rounded-lg border border-gray-300/90 bg-white p-4 md:p-5">
                <form className="flex flex-wrap items-end gap-3" onSubmit={handleCreateToken}>
                    <div className="min-w-[16rem] flex-1">
                        <label htmlFor="note" className="text-sm font-semibold text-gray-900">Ghi chú token</label>
                        <input
                            id="note"
                            name="note"
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Ví dụ: Firebase sync worker"
                            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/15"
                        />
                    </div>

                    <div className="w-full sm:w-64">
                        <label htmlFor="expire_option" className="text-sm font-semibold text-gray-900">Thời gian hết hạn</label>
                        <select
                            id="expire_option"
                            value={expireOption}
                            onChange={(event) => setExpireOption(event.target.value as TokenExpireOption)}
                            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/15"
                        >
                            <option value="never">Không hết hạn</option>
                            <option value="1h">1 giờ</option>
                            <option value="1d">1 ngày</option>
                            <option value="7d">7 ngày</option>
                            <option value="30d">30 ngày</option>
                        </select>
                    </div>

                    <div className="w-full sm:w-auto sm:self-end">
                        <Button type="submit" className="h-11 rounded-md border border-gray-300 px-6 text-gray-900 hover:bg-gray-100">Tạo token mới</Button>
                    </div>
                </form>
            </section>

            <section className="rounded-lg border border-gray-300/90 bg-white p-4 md:p-5">
                <form className="grid gap-3 md:grid-cols-3" onSubmit={handleChangePassword}>
                    <div>
                        <label className="text-sm font-semibold text-gray-900" htmlFor="current_password">Mật khẩu hiện tại</label>
                        <input
                            id="current_password"
                            type="password"
                            value={currentPassword}
                            onChange={(event) => setCurrentPassword(event.target.value)}
                            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900"
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-900" htmlFor="new_password">Mật khẩu mới</label>
                        <input
                            id="new_password"
                            type="password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900"
                            placeholder="Ít nhất 8 ký tự"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-900" htmlFor="confirm_password">Xác nhận mật khẩu mới</label>
                        <input
                            id="confirm_password"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900"
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                        <Button type="submit" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100">
                            Đổi mật khẩu
                        </Button>
                    </div>
                </form>
            </section>

            <section className="overflow-hidden rounded-lg border border-gray-300/90 bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">Danh sách token</p>
                    <p className="text-sm text-gray-500">{tokenCountLabel}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-190 text-left text-sm text-gray-900">
                        <thead className="bg-white text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Token</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3">Ghi chú</th>
                                <th className="px-4 py-3">Tạo lúc</th>
                                <th className="px-4 py-3">Hết hạn</th>
                                <th className="px-4 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                                        Chưa có token nào. Hãy tạo token đầu tiên để dùng cho các luồng API sau này.
                                    </td>
                                </tr>
                            ) : (
                                tokens.map((item, index) => (
                                    <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                                        <td className="px-4 py-4">
                                            <code className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                                {item.token.slice(0, 16)}...{item.token.slice(-8)}
                                            </code>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isTokenExpired(item) ? "bg-red-100 text-red-700" : "bg-[#e6f4ea] text-[#137333]"}`}>
                                                {isTokenExpired(item) ? "Expired" : item.status === "active" ? "Active" : "Revoked"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-500">{item.note}</td>
                                        <td className="px-4 py-4 text-gray-500">{formatDateTime(item.created_at)}</td>
                                        <td className="px-4 py-4 text-gray-500">{item.expires_at ? formatDateTime(item.expires_at) : "Không hết hạn"}</td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="inline-flex gap-2">
                                                <Button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 hover:bg-gray-100" onClick={() => void handleCopyToken(item.token)}>
                                                    Copy
                                                </Button>
                                                <Button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-[#b3261e] hover:bg-gray-100" onClick={() => handleDeleteToken(item.id)}>
                                                    Xóa
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AccountApiPage;
