import type { ReactNode } from "react";
import { Link } from "react-router";

const PublicLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-md bg-[#1a73e8] text-xs font-black text-white">
                            GMS
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Cloud suite</p>
                            <p className="text-sm font-semibold leading-none text-gray-900">GMS Cloud</p>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-2">
                        <Link
                            to="/document"
                            className="hidden rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors md:block"
                        >
                            Docs
                        </Link>
                        <Link
                            to="/auth/login"
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/auth/register"
                            className="rounded-md bg-[#1a73e8] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                        >
                            Đăng ký
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-5 py-8">
                {children}
            </main>
        </div>
    );
};

export default PublicLayout;