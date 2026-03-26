import { type ChangeEvent, type FormEvent, useState } from "react";
import { type LoginResponse, type LoginForm } from "../../../services/types/auth.type";
import { useExecute } from "../../../common/hooks/useExecute";
import { AuthModule } from "../../../services/modules/auth.module";
import { useNotificate } from "../../../common/hooks/useNotificate";
import { useAuthenticate } from "../../../common/hooks/useAuthenticate";

const inputClasses =
    "mt-2 w-full rounded-xl border border-[#c6c0b3] bg-white px-4 py-3 text-sm text-[#2d2a26] placeholder:text-[#9c9688] transition focus:border-[#2d2a26] focus:outline-none focus:ring-2 focus:ring-[#b79c6d]/30";

const LoginPage = () => {
    const { Login } = AuthModule;
    const { execute } = useExecute<LoginResponse>();
    const notificate = useNotificate();
    const authenticate = useAuthenticate();

    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.email || !form.password) {
            return;
        }

        const payload = await execute(() => Login(form), {
            onError: () => {
                notificate.showToast({
                    type: "error",
                    title: "Đăng nhập thất bại",
                    message: "Vui lòng kiểm tra lại thông tin đăng nhập."
                });
            },
            onSuccess: () => {
                notificate.showToast({
                    type: "success",
                    title: "Thành công",
                    message: "Đăng nhập thành công"
                });
            }
        });

        if (payload) {
            authenticate.saveState(payload);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f5ee] flex items-center justify-center">
            <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-4xl border border-[#dcd6c6] bg-white/95 shadow-[0_30px_110px_rgba(28,24,19,0.12)] lg:flex-row">
                <section className="flex flex-col gap-6 bg-[#f1ece1] px-10 py-12 lg:w-5/12">
                    <p className="text-sm uppercase tracking-[0.3em] text-[#947c52]">URL Shortener</p>
                    <h1 className="text-4xl font-serif text-[#2d2a26]">Đăng nhập</h1>
                    <p className="text-sm leading-relaxed text-[#4d493f]">
                        Quản lý đường dẫn thương hiệu của bạn với giao diện tối giản, nhấn mạnh sự
                        chính xác và ổn định.
                    </p>
                    <div className="space-y-4 text-sm text-[#4d493f]">
                        <div className="rounded-2xl border border-[#d5cfc1] bg-white/70 p-4">
                            <p className="font-medium text-[#2d2a26]">Tại sao chọn nền tảng này?</p>
                            <ul className="mt-3 space-y-2 list-disc list-inside">
                                <li>Đo lường lượt click theo thời gian thực</li>
                                <li>Bảo vệ liên kết với cơ chế xác thực nhiều tầng</li>
                                <li>Giao diện cổ điển, dễ tập trung vào công việc</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="flex-1 px-10 py-12">
                    <form className="flex h-full flex-col gap-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm font-semibold text-[#2d2a26]" htmlFor="email">
                                Email công việc
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                className={inputClasses}
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-[#2d2a26]" htmlFor="password">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Nhập mật khẩu"
                                className={inputClasses}
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm text-[#4d493f]">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="h-4 w-4 accent-[#2d2a26]" /> Ghi nhớ tôi
                            </label>
                            <a className="text-[#7c6540] hover:underline" href="#">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="mt-auto rounded-2xl bg-[#2d2a26] px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#1c1915]"
                        >
                            Đăng nhập
                        </button>

                        <p className="text-center text-sm text-[#4d493f]">
                            Chưa có tài khoản? <a className="font-semibold text-[#7c6540] hover:underline" href="/register">Đăng ký ngay</a>
                        </p>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default LoginPage;