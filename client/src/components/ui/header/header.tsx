import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthenticate } from "../../../common/hooks/useAuthenticate";
import Button from "../button/button";

type Suggestion = {
    label: string;
    path: string;
    icon: string;
};

const suggestions: Suggestion[] = [
    { label: "Tệp của tôi", path: "/page/files", icon: "fa-regular fa-folder-open" },
    { label: "Short URL", path: "/page/urls", icon: "fa-solid fa-link" },
    { label: "API Keys", path: "/page/account/api", icon: "fa-solid fa-key" },
    { label: "Thông tin tài khoản", path: "/page/account/info", icon: "fa-regular fa-user" },
    { label: "Quản lý gói", path: "/page/plans", icon: "fa-regular fa-gem" },
    { label: "Documentation", path: "/document", icon: "fa-regular fa-file-lines" },
];

const Header = () => {
    const navigate = useNavigate();
    const { state, clearState } = useAuthenticate();

    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const filtered = search.trim()
        ? suggestions.filter(
              (s) =>
                  s.label.toLowerCase().includes(search.toLowerCase()) ||
                  s.path.toLowerCase().includes(search.toLowerCase())
          )
        : suggestions;

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const goTo = (path: string) => {
        setShowDropdown(false);
        setShowUserMenu(false);
        if (path === "/auth/logout") {
            clearState();
            window.location.href = "/auth/login";
            return;
        }
        navigate(path);
    };

    const userMenuItems = [
        { label: "Thông tin", path: "/page/account/info" },
        { label: "API Keys", path: "/page/account/api" },
        { label: "Đăng xuất", path: "/auth/logout" },
    ];

    return (
        <div className="flex h-14 items-center gap-4">
            {/* Brand */}
            <div className="flex shrink-0 items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-[#1a73e8] text-xs font-black text-white">
                    GMS
                </div>
                <span className="hidden text-sm font-semibold text-gray-900 lg:block">GMS Cloud</span>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-lg" ref={searchRef}>
                <div className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 focus-within:border-[#1a73e8] focus-within:bg-white transition-colors">
                    <i className="fa-solid fa-magnifying-glass text-sm text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                            <i className="fa-solid fa-xmark text-xs" />
                        </button>
                    )}
                </div>

                {showDropdown && (
                    <div className="absolute top-full left-0 z-30 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                        {filtered.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-400">Không tìm thấy kết quả</p>
                        ) : (
                            filtered.map((s) => (
                                <button
                                    key={s.path}
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors"
                                    onClick={() => goTo(s.path)}
                                >
                                    <i className={`${s.icon} w-4 text-center text-gray-400`} />
                                    <span className="text-gray-800">{s.label}</span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Right */}
            <div className="flex shrink-0 items-center gap-2 ml-auto">
                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                    <Button
                        className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white pl-2 pr-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu((v) => !v)}
                    >
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#1a73e8] text-xs text-white font-semibold">
                            {(state?.email?.[0] ?? "U").toUpperCase()}
                        </span>
                        <span className="hidden max-w-36 truncate sm:block">{state?.email ?? "User"}</span>
                        <i className="fa-solid fa-chevron-down text-xs text-gray-400" />
                    </Button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-full z-30 mt-1 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                            <div className="border-b border-gray-100 px-4 py-2.5">
                                <p className="truncate text-xs font-semibold text-gray-900">{state?.email}</p>
                                <p className="text-xs text-gray-400">{state?.plan?.name ?? "Free"}</p>
                            </div>
                            {userMenuItems.map((item) => (
                                <Button
                                    key={item.path}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                                        item.path === "/auth/logout"
                                            ? "text-red-600"
                                            : "text-gray-700"
                                    }`}
                                    onClick={() => goTo(item.path)}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;