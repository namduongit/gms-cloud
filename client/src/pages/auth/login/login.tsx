import { type ChangeEvent, type FormEvent, useState } from "react";
import { Link } from "react-router";
import type { LoginResponse, LoginForm } from "../../../services/types/auth.type";
import { useExecute } from "../../../common/hooks/useExecute";
import { AuthModule } from "../../../services/modules/auth.module";
import { useNotificate } from "../../../common/hooks/useNotificate";
import { useAuthenticate } from "../../../common/hooks/useAuthenticate";
import PublicLayout from "../../../components/layout/public-layout";
import Button from "../../../components/ui/button/button";

const inputCls =
    "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/10 transition-colors";

const LoginPage = () => {
    const { Login } = AuthModule;
    const { execute, loading } = useExecute<LoginResponse>();
    const notificate = useNotificate();
    const authenticate = useAuthenticate();

    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.email || !form.password) return;

        await execute(() => Login(form), {
            onError: () => {
                notificate.showToast({
                    type: "error",
                    title: "Đăng nhập thất bại",
                    message: "Email hoặc mật khẩu không đúng.",
                });
            },
            onSuccess: (result) => {
                authenticate.saveState(result);
                notificate.showToast({ type: "success", title: "Thành công", message: "Đang chuyển trang…" });
                setTimeout(() => window.location.reload(), 800);
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
                    <h1 className="text-2xl font-semibold text-gray-900">Đăng nhập</h1>
                    <p className="mt-1 text-sm text-gray-500">Truy cập GMS Cloud workspace của bạn</p>
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
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700" htmlFor="password">
                                Mật khẩu
                            </label>
                            <a href="#" className="text-xs text-[#1a73e8] hover:underline">
                                Quên mật khẩu?
                            </a>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            className={inputCls}
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="mt-1 flex w-full items-center justify-center rounded-lg bg-[#1a73e8] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                        loading={loading}
                        loadingText="Đang đăng nhập…"
                        disabled={!form.email || !form.password}
                    >
                        Đăng nhập
                    </Button>
                </form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-400">hoặc</span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500">
                    Chưa có tài khoản?{" "}
                    <Link className="font-semibold text-[#1a73e8] hover:underline" to="/auth/register">
                        Đăng ký miễn phí
                    </Link>
                </p>
            </div>
        </PublicLayout>
    );
};

export default LoginPage;