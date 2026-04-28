import { type ChangeEvent, type FormEvent, useState } from "react";
import Button from "../../components/ui/button/button";
import { useExecute } from "../../common/hooks/useExecute";
import { useNotificate } from "../../common/hooks/useNotificate";
import { AuthModule } from "../../services/modules/auth.module";
import type { ChangePasswordForm } from "../../services/types/auth.type";
import { useAuthenticate } from "../../common/hooks/useAuthenticate";

const inputCls =
    "mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10 transition-colors";

const defaultForm: ChangePasswordForm = {
    current_password: "",
    new_password: "",
    password_confirm: "",
};

// Mock activity log — replace with real API when available
const mockLogs = [
    { id: 1, type: "login", message: "Đăng nhập từ trình duyệt Chrome · Windows", time: "Vừa xong" },
    { id: 2, type: "login", message: "Đăng nhập từ trình duyệt Chrome · Windows", time: "3 giờ trước" },
    { id: 3, type: "password", message: "Mật khẩu được thay đổi thành công", time: "2 ngày trước" },
    { id: 4, type: "login", message: "Đăng nhập từ thiết bị mới · Mobile", time: "5 ngày trước" },
    { id: 5, type: "login", message: "Đăng nhập từ trình duyệt Firefox · macOS", time: "1 tuần trước" },
];

const logIcon: Record<string, string> = {
    login: "fa-solid fa-arrow-right-to-bracket",
    password: "fa-solid fa-key",
};

const logColor: Record<string, string> = {
    login: "text-blue-500 bg-blue-50 border-blue-200",
    password: "text-amber-600 bg-amber-50 border-amber-200",
};

const SecurityPage = () => {
    const { ChangePassword } = AuthModule;
    const { state, clearState } = useAuthenticate();
    const notificate = useNotificate();
    const { execute, loading } = useExecute<null>();

    const [form, setForm] = useState<ChangePasswordForm>(defaultForm);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.current_password || !form.new_password || !form.password_confirm) {
            notificate.showToast({ type: "error", title: "Thiếu thông tin", message: "Vui lòng điền đầy đủ các trường." });
            return;
        }

        if (form.new_password !== form.password_confirm) {
            notificate.showToast({ type: "error", title: "Không khớp", message: "Mật khẩu mới và xác nhận phải giống nhau." });
            return;
        }

        await execute(() => ChangePassword(form), {
            onSuccess: () => {
                setForm(defaultForm);
                notificate.showToast({
                    type: "success",
                    title: "Đổi mật khẩu thành công",
                    message: "Bạn sẽ được đăng xuất để đăng nhập lại.",
                });
                // Invalidate old session after password change
                setTimeout(() => {
                    clearState();
                    window.location.href = "/auth/login";
                }, 2000);
            },
            onError: () => {
                notificate.showToast({
                    type: "error",
                    title: "Đổi mật khẩu thất bại",
                    message: "Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra.",
                });
            },
        });
    };

    return (
        <div className="space-y-5">
            {/* Page header */}
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Bảo mật</h1>
                <p className="mt-0.5 text-sm text-gray-500">Quản lý mật khẩu và xem lịch sử hoạt động tài khoản.</p>
            </div>

            {/* Account info card */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1a73e8] text-sm font-bold text-white">
                    {(state?.email?.[0] ?? "U").toUpperCase()}
                </span>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{state?.email ?? "—"}</p>
                    <p className="text-xs text-gray-400">Gói: {state?.plan?.name ?? "Free"}</p>
                </div>
            </div>

            {/* Change password form */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-3.5">
                    <p className="text-sm font-semibold text-gray-900">Đổi mật khẩu</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                        Sau khi đổi thành công, bạn sẽ được đăng xuất và cần đăng nhập lại.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4 p-5 sm:grid-cols-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700" htmlFor="current_password">
                            Mật khẩu hiện tại
                        </label>
                        <input
                            id="current_password"
                            name="current_password"
                            type="password"
                            className={inputCls}
                            placeholder="Nhập mật khẩu hiện tại"
                            value={form.current_password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700" htmlFor="new_password">
                            Mật khẩu mới
                        </label>
                        <input
                            id="new_password"
                            name="new_password"
                            type="password"
                            className={inputCls}
                            placeholder="Tối thiểu 8 ký tự"
                            value={form.new_password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700" htmlFor="password_confirm">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            id="password_confirm"
                            name="password_confirm"
                            type="password"
                            className={inputCls}
                            placeholder="Nhập lại mật khẩu mới"
                            value={form.password_confirm}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="flex items-center justify-end sm:col-span-3">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-[#1a73e8] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {loading ? "Đang xử lý…" : "Đổi mật khẩu"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Activity log */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Lịch sử hoạt động</p>
                        <p className="mt-0.5 text-xs text-gray-400">Các lần đăng nhập và thay đổi bảo mật gần đây.</p>
                    </div>
                    <span className="text-xs text-gray-400">{mockLogs.length} mục</span>
                </div>

                <div className="divide-y divide-gray-100">
                    {mockLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                            <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border text-xs ${logColor[log.type]}`}>
                                <i className={logIcon[log.type]} />
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800">{log.message}</p>
                            </div>
                            <span className="shrink-0 text-xs text-gray-400">{log.time}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-100 px-5 py-3 text-center">
                    <p className="text-xs text-gray-400">
                        Lịch sử đầy đủ sẽ được hiển thị khi API sẵn sàng.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;
