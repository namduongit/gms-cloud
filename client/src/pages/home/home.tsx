import { createElement, useEffect } from "react";
import { Link } from "react-router";
import PublicLayout from "../../components/layout/public-layout";

const features = [
    {
        icon: "fa-regular fa-folder-open",
        title: "Quản lý file & folder",
        description: "Tổ chức tệp theo thư mục, điều hướng bằng breadcrumb.",
    },
    {
        icon: "fa-solid fa-link",
        title: "Short URL",
        description: "Tạo và theo dõi liên kết rút gọn trong một workspace.",
    },
    {
        icon: "fa-solid fa-key",
        title: "API & Developer",
        description: "Quản lý token API, xem tài liệu tích hợp trực tiếp.",
    },
];

const HomePage = () => {
    useEffect(() => {
        const existing = document.querySelector("script[data-dotlottie-player='true']");
        if (existing) return;
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.10/dist/dotlottie-wc.js";
        script.type = "module";
        script.setAttribute("data-dotlottie-player", "true");
        document.body.appendChild(script);
    }, []);

    return (
        <PublicLayout>
            <div className="space-y-6">
                {/* Hero */}
                <section className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#1a73e8]">GMS Cloud</p>
                        <h1 className="mt-3 text-4xl font-semibold leading-tight text-gray-900 md:text-5xl">
                            File, URL và API<br />trong một nơi.
                        </h1>
                        <p className="mt-4 max-w-lg text-base text-gray-500">
                            Lưu trữ file, rút gọn liên kết và quản lý API token trong cùng một dashboard đơn giản.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                to="/auth/register"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#1a73e8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                            >
                                Bắt đầu miễn phí
                            </Link>
                            <Link
                                to="/document"
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <i className="fa-regular fa-file-lines text-gray-400" />
                                Xem tài liệu
                            </Link>
                        </div>
                    </div>

                    <div className="hidden justify-center md:flex">
                        {createElement("dotlottie-wc", {
                            src: "https://lottie.host/a76e30db-976c-45e7-9bed-efe7c84c8317/GKUs9NOScO.lottie",
                            style: { width: "260px", height: "260px" },
                            autoplay: true,
                            loop: true,
                        })}
                    </div>
                </section>

                {/* Feature cards */}
                <section className="grid gap-3 sm:grid-cols-3">
                    {features.map((f) => (
                        <div key={f.title} className="rounded-lg border border-gray-200 bg-white p-5">
                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-[#1a73e8]">
                                <i className={`${f.icon} text-sm`} />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                            <p className="mt-1.5 text-sm text-gray-500">{f.description}</p>
                        </div>
                    ))}
                </section>

                {/* Quick access + contact */}
                <section className="grid gap-4 md:grid-cols-2">
                    {/* Quick access */}
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <p className="text-sm font-semibold text-gray-900">Truy cập nhanh</p>
                        <p className="mt-1 text-xs text-gray-400">Đi thẳng đến từng phần của hệ thống.</p>
                        <div className="mt-4 space-y-1">
                            {[
                                { to: "/page/files", label: "Quản lý file & folder", sub: "Storage" },
                                { to: "/page/urls", label: "Short URL", sub: "Link" },
                                { to: "/page/account/info", label: "Hồ sơ tài khoản", sub: "Account" },
                                { to: "/page/account/api", label: "API Dashboard", sub: "Developer" },
                            ].map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <span>{item.label}</span>
                                    <span className="text-xs text-gray-400">{item.sub}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="rounded-lg border border-gray-200 bg-white p-5">
                        <p className="text-sm font-semibold text-gray-900">Liên hệ</p>
                        <p className="mt-1 text-xs text-gray-400">Hỗ trợ tích hợp, vận hành và tùy biến.</p>
                        <div className="mt-4 space-y-1">
                            {[
                                { icon: "fa-regular fa-envelope", label: "Email", value: "nguyennamduong205@gmail.com", href: "mailto:nguyennamduong205@gmail.com" },
                                { icon: "fa-solid fa-phone", label: "SĐT", value: "0388853835", href: "tel:0388853835" },
                                { icon: "fa-brands fa-github", label: "GitHub", value: "namduongit", href: "https://github.com/namduongit" },
                                { icon: "fa-brands fa-facebook", label: "Facebook", value: "namduongit", href: "https://facebook.com/namduongit" },
                            ].map((c) => (
                                <a
                                    key={c.href}
                                    href={c.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2 text-gray-500">
                                        <i className={`${c.icon} w-4 text-center`} />
                                        {c.label}
                                    </span>
                                    <span className="text-gray-700">{c.value}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 pt-5 text-xs text-gray-400">
                    GMS Cloud · File, URL & API Management
                </footer>
            </div>
        </PublicLayout>
    );
};

export default HomePage;