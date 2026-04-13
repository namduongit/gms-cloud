import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import Button from "../../components/ui/button/button";
import CreateTokenModal from "../../components/ui/modal/create-token/create-token-modal";
import { useExecute } from "../../common/hooks/useExecute";
import { useNotificate } from "../../common/hooks/useNotificate";
import { AuthModule } from "../../services/modules/auth.module";
import { TokenModule } from "../../services/modules/token.module";
import type { ChangePasswordForm } from "../../services/types/auth.type";
import type { CreateTokenForm, TokenListResponse, TokenResponse } from "../../services/types/token.type";
import { formatDriveDate } from "../../services/utils/date";

const defaultTokenForm: CreateTokenForm = {
    name: "",
    time: 0
};

const defaultPasswordForm: ChangePasswordForm = {
    current_password: "",
    new_password: "",
    password_confirm: ""
};

const AccountApiPage = () => {
    const { GetToken, CreateToken, DeleteToken } = TokenModule;
    const { ChangePassword } = AuthModule;
    const notificate = useNotificate();

    const { execute: executeGetTokens, loading: loadingTokens } = useExecute<TokenListResponse>();
    const { execute: executeCreateToken, loading: creatingToken } = useExecute<TokenResponse>();
    const { execute: executeDeleteToken } = useExecute<null>();
    const { execute: executeChangePassword, loading: changingPassword } = useExecute<null>();

    const [tokens, setTokens] = useState<TokenResponse[]>([]);
    const [form, setForm] = useState<CreateTokenForm>(defaultTokenForm);
    const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>(defaultPasswordForm);
    const [createdToken, setCreatedToken] = useState<{ publicToken: string; privateToken: string } | null>(null);

    const isTokenExpired = (token: TokenResponse) => {
        if (!token.expires_at) {
            return false;
        }

        return new Date(token.expires_at).getTime() <= Date.now();
    };

    const handleCopyToken = async (token: string) => {
        try {
            await navigator.clipboard.writeText(token);
            notificate.showToast({
                type: "success",
                title: "Đã sao chép token",
                message: "Token đã được copy vào clipboard."
            });
        } catch {
            notificate.showToast({
                type: "error",
                title: "Không thể sao chép token",
                message: "Trình duyệt không cho phép truy cập clipboard."
            });
        }
    };

    const handleCreateToken = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.name.trim()) {
            notificate.showToast({
                type: "error",
                title: "Thiếu ghi chú token",
                message: "Vui lòng nhập ghi chú trước khi tạo token."
            });
            return;
        }

        const payload: CreateTokenForm = {
            name: form.name,
            ...(form.time && form.time > 0 ? { time: form.time } : {})
        };

        await executeCreateToken(() => CreateToken(payload), {
            onSuccess: (token) => {
                setTokens((previousTokens) => [token, ...previousTokens]);
                setForm(defaultTokenForm);
                if (token.private_token) {
                    setCreatedToken({
                        publicToken: token.public_token ?? token.token,
                        privateToken: token.private_token
                    });
                }
                notificate.showToast({
                    type: "success",
                    title: "Đã tạo token",
                    message: token.private_token
                        ? "Token đã được tạo. Hãy copy private token ngay bây giờ vì chỉ hiển thị một lần."
                        : "Token mới đã sẵn sàng sử dụng."
                });
            },
            onError: () => {
                notificate.showToast({
                    type: "error",
                    title: "Tạo token thất bại",
                    message: "Không thể tạo token mới. Vui lòng thử lại."
                });
            }
        });
    };

    const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.password_confirm) {
            notificate.showToast({
                type: "error",
                title: "Thiếu thông tin",
                message: "Vui lòng điền đầy đủ mật khẩu hiện tại và mật khẩu mới."
            });
            return;
        }

        if (passwordForm.new_password !== passwordForm.password_confirm) {
            notificate.showToast({
                type: "error",
                title: "Xác nhận mật khẩu không khớp",
                message: "Mật khẩu mới và phần xác nhận phải giống nhau."
            });
            return;
        }

        await executeChangePassword(() => ChangePassword(passwordForm), {
            onSuccess: () => {
                setPasswordForm(defaultPasswordForm);
                notificate.showToast({
                    type: "success",
                    title: "Đã gửi yêu cầu đổi mật khẩu",
                    message: "Khi API sẵn sàng, biểu mẫu này sẽ hoạt động ngay."
                });
            },
            onError: () => {
                notificate.showToast({
                    type: "error",
                    title: "Đổi mật khẩu thất bại",
                    message: "Chức năng này đang chờ API phía backend."
                });
            }
        });
    };

    const handleDeleteToken = async (uuid: string) => {
        const accepted = window.confirm("Bạn có chắc muốn xóa token này?");
        if (!accepted) {
            return;
        }

        await executeDeleteToken(() => DeleteToken(uuid), {
            onSuccess: () => {
                setTokens((previousTokens) => previousTokens.filter((token) => token.uuid !== uuid));
                notificate.showToast({
                    type: "success",
                    title: "Đã xóa token",
                    message: "Token đã được gỡ khỏi tài khoản."
                });
            },
            onError: () => {
                notificate.showToast({
                    type: "error",
                    title: "Xóa token thất bại",
                    message: "Không thể xóa token ở thời điểm này."
                });
            }
        });
    };

    const handleTokenChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setForm((previousForm) => ({
            ...previousForm,
            [name]: name === "time" ? Number(value) : value
        }));
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPasswordForm((previousForm) => ({
            ...previousForm,
            [name]: value
        }));
    };

    useEffect(() => {
        void executeGetTokens(() => GetToken(), {
            onSuccess: (data) => {
                setTokens(data.tokens ?? []);
            },
            onError: () => {
                setTokens([]);
                notificate.showToast({
                    type: "error",
                    title: "Không tải được token",
                    message: "Vui lòng thử lại sau ít phút."
                });
            }
        });
    }, []);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between p-2">
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
                            name="name"
                            value={form.name}
                            onChange={handleTokenChange}
                            placeholder="Ví dụ: Firebase sync worker"
                            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/15"
                        />
                    </div>

                    <div className="w-full sm:w-64">
                        <label htmlFor="expire_option" className="text-sm font-semibold text-gray-900">Thời gian hết hạn</label>
                        <select
                            id="expire_option"
                            name="time"
                            value={String(form.time ?? 0)}
                            onChange={handleTokenChange}
                            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/15"
                        >
                            <option value="0">Không hết hạn</option>
                            <option value="7">7 ngày</option>
                            <option value="30">30 ngày</option>
                            <option value="90">90 ngày</option>
                        </select>
                    </div>

                    <div className="w-full sm:w-auto sm:self-end">
                        <Button disabled={creatingToken || loadingTokens} className="text-sm font-semibold h-11 rounded-md border border-gray-300 px-6 text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60">
                            {creatingToken ? "Đang tạo..." : "Tạo token mới"}
                        </Button>
                    </div>
                </form>
            </section>

            <section className="rounded-lg border border-gray-300/90 bg-white p-4 md:p-5">
                <form className="grid gap-3 md:grid-cols-3" onSubmit={handleChangePassword}>
                    <div>
                        <label className="text-sm font-semibold text-gray-900" htmlFor="current_password">Mật khẩu hiện tại</label>
                        <input
                            id="current_password"
                            name="current_password"
                            type="password"
                            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900"
                            placeholder="Nhập mật khẩu hiện tại"
                            value={passwordForm.current_password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-900" htmlFor="new_password">Mật khẩu mới</label>
                        <input
                            id="new_password"
                            name="new_password"
                            type="password"
                            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900"
                            placeholder="Ít nhất 8 ký tự"
                            value={passwordForm.new_password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-900" htmlFor="confirm_password">Xác nhận mật khẩu mới</label>
                        <input
                            id="confirm_password"
                            name="password_confirm"
                            type="password"
                            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900"
                            placeholder="Nhập lại mật khẩu mới"
                            value={passwordForm.password_confirm}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="flex justify-end md:col-span-3">
                        <Button type="submit" disabled={changingPassword} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60">
                            {changingPassword ? "Đang gửi..." : "Đổi mật khẩu"}
                        </Button>
                    </div>
                </form>
            </section>

            <section className="overflow-hidden rounded-lg border border-gray-300/90 bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">Danh sách token</p>
                    <p className="text-sm text-gray-500">{loadingTokens ? "Đang tải..." : tokens.length}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-190 text-left text-sm text-gray-900">
                        <thead className="bg-white text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Token</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3">Ghi chú</th>
                                <th className="px-4 py-3">Hết hạn</th>
                                <th className="px-4 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                                        Chưa có token nào. Hãy tạo token đầu tiên để dùng cho các luồng API sau này.
                                    </td>
                                </tr>
                            ) : (
                                tokens.map((token, index) => (
                                    <tr key={token.uuid} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                                        <td className="px-4 py-4">
                                            <code className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                                {(token.public_token ?? token.token).slice(0, 16)}...{(token.public_token ?? token.token).slice(-8)}
                                            </code>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isTokenExpired(token) ? "bg-red-100 text-red-700" : "bg-[#e6f4ea] text-[#137333]"}`}>
                                                {isTokenExpired(token) ? "Expired" : "Active"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-500">{token.name}</td>
                                        <td className="px-4 py-4 text-gray-500">{token.expires_at ? formatDriveDate(token.expires_at) : "Không hết hạn"}</td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="inline-flex gap-2">
                                                <Button type="button" className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 hover:bg-gray-100" onClick={() => void handleCopyToken(token.public_token ?? token.token)}>
                                                    Copy
                                                </Button>
                                                <Button type="button" className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-[#b3261e] hover:bg-gray-100" onClick={() => void handleDeleteToken(token.uuid)}>
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

            <CreateTokenModal
                isOpen={createdToken !== null}
                publicToken={createdToken?.publicToken ?? ""}
                privateToken={createdToken?.privateToken ?? ""}
                onClose={() => setCreatedToken(null)}
                onCopyToken={handleCopyToken}
            />
        </div>
    );
};

export default AccountApiPage;
