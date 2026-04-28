import { NavLink } from "react-router";
import { useAuthenticate } from "../../../common/hooks/useAuthenticate";

const mainLinks = [
    {
        to: "/page/files",
        icon: "fa-regular fa-folder-open",
        label: "Tệp của tôi",
    },
    {
        to: "/page/urls",
        icon: "fa-solid fa-link",
        label: "Short URL",
    },
    {
        to: "/page/plans",
        icon: "fa-regular fa-gem",
        label: "Gói dịch vụ",
    },
];

const accountLinks = [
    { to: "/page/account/info", icon: "fa-regular fa-user", label: "Hồ sơ" },
    { to: "/page/account/api", icon: "fa-solid fa-key", label: "API Keys" },
    { to: "/page/account/security", icon: "fa-solid fa-shield-halved", label: "Bảo mật" },
];

const toGb = (v: number) => (v / 1024 / 1024 / 1024).toFixed(2);

const NavItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${isActive
                ? "bg-blue-50 font-semibold text-blue-700"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`
        }
    >
        <i className={`${icon} w-4 shrink-0 text-center`} />
        {label}
    </NavLink>
);

const Sidebar = () => {
    const { authConfig } = useAuthenticate();

    const used = authConfig?.usage.used_storage ?? 0;
    const total = authConfig?.usage.quota_bytes ?? 0;
    const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;

    return (
        <nav className="flex flex-col gap-px py-1">
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Drive
            </p>
            {mainLinks.map((l) => (
                <NavItem key={l.to} {...l} />
            ))}

            <div className="my-3 h-px bg-gray-100" />

            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Tài khoản
            </p>
            {accountLinks.map((l) => (
                <NavItem key={l.to} {...l} />
            ))}

            <div className="my-3 h-px bg-gray-100" />

            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">Dung lượng</span>
                    <span className="font-semibold text-gray-700">{pct}%</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                        className="h-full rounded-full bg-[#1a73e8] transition-all"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    {toGb(used)} GB / {toGb(total)} GB
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                    Gói:{" "}
                    <span className="font-medium text-gray-600">
                        {authConfig?.plan_name ?? "—"}
                    </span>
                </p>
                <NavLink
                    to="/page/plans"
                    className="mt-3 block w-full rounded-md border border-gray-200 py-1.5 text-center text-xs font-medium text-[#1a73e8] hover:bg-gray-50 transition-colors"
                >
                    Nâng cấp
                </NavLink>
            </div>
        </nav>
    );
};

export default Sidebar;
