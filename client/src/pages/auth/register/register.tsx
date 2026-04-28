import { type ChangeEvent, type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { RegisterResponse, RegisterForm } from "../../../services/types/auth.type";
import PublicLayout from "../../../components/layout/public-layout";
import Button from "../../../components/ui/button/button";
import { AuthModule } from "../../../services/modules/auth.module";
import { useExecute } from "../../../common/hooks/useExecute";
import { useNotificate } from "../../../common/hooks/useNotificate";

const inputCls =
    "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10 transition-colors";

const RegisterPage = () => {
    const { Register } = AuthModule;
    const { execute, loading } = useExecute<RegisterResponse>();
    const notificate = useNotificate();
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterForm>({ email: "", password: "", password_confirm: "" });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.email || !form.password || !form.password_confirm) {
            notificate.showToast({ type: "warning", title: "Thiếu thông tin", message: "Vui lòng điền đầy đủ." });
            return;
        }

        if (form.password !== form.password_confirm) {
            notificate.showToast({ type: "error", title: "Lỗi", message: "Mật khẩu xác nhận không khớp." });
            return;
        }

        execute(() => Register(form), {
            onError: () => {
                notificate.showToast({ type: "error", title: "Đăng ký thất bại", message: "Email đã tồn tại hoặc dữ liệu không hợp lệ." });
            },
            onSuccess: async () => {
                await notificate.showAlert({
                    title: "Kiểm tra hộp thư",
                    message:
                        "Tài khoản đã được tạo. Vui lòng mở email và nhấn vào liên kết xác thực trước khi đăng nhập.",
                });
                navigate("/auth/login");
            },
        });
    };

    return (
        <PublicLayout>
            <div className="mx-auto max-w-sm py-8">
                {/* Heading */}
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-lg bg-[#1a73e8] text-sm font-black text-white">
                        GMS
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Tạo tài khoản</h1>
                    <p className="mt-1 text-sm text-gray-500">Miễn phí, không cần thẻ tín dụng</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            className={inputCls}
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Tối thiểu 8 ký tự"
                            className={inputCls}
                            value={form.password}
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
                            placeholder="Nhập lại mật khẩu"
                            className={inputCls}
                            value={form.password_confirm}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <p className="text-xs text-gray-400">
                        Bằng cách đăng ký, bạn đồng ý với điều khoản sử dụng của hệ thống.
                    </p>

                    <Button
                        type="submit"
                        className="mt-1 flex w-full items-center justify-center rounded-lg bg-[#1a73e8] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                        disabled={loading}
                        loadingText="Đang tạo tài khoản…"
                    >
                        Tạo tài khoản
                    </Button>
                </form>

                {/* Footer */}
                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-400">hoặc</span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <p className="text-center text-sm text-gray-500">
                    Đã có tài khoản?{" "}
                    <Link className="font-semibold text-[#1a73e8] hover:underline" to="/auth/login">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </PublicLayout>
    );
};

export default RegisterPage;
