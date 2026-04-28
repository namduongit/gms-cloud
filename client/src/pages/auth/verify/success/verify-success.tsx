import { Link } from "react-router";

const VerifySuccessPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                    <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Content */}
                <h1 className="text-2xl font-semibold text-gray-900">Email đã được xác thực</h1>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                    Tài khoản của bạn đã được kích hoạt thành công.
                    Bạn có thể đăng nhập và bắt đầu sử dụng GMS Cloud.
                </p>

                {/* Divider */}
                <div className="my-6 h-px bg-gray-200" />

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        to="/auth/login"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a73e8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                        <i className="fa-solid fa-right-to-bracket"></i>
                        Đăng nhập ngay
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <i className="fa-solid fa-house"></i>
                        Trang chủ
                    </Link>
                </div>

                {/* Footer brand */}
                <p className="mt-8 text-xs text-gray-400">GMS Cloud · Dịch vụ quản lý file & URL</p>
            </div>
        </div>
    );
};

export default VerifySuccessPage;
