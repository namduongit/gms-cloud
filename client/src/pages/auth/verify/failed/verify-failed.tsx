import { Link } from "react-router";

const VerifyFailedPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 border border-red-200">
                    <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>

                {/* Content */}
                <h1 className="text-2xl font-semibold text-gray-900">Xác thực không thành công</h1>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                    Liên kết xác thực không hợp lệ hoặc đã hết hạn.
                    Vui lòng yêu cầu gửi lại email xác thực để thử lại.
                </p>

                {/* Divider */}
                <div className="my-6 h-px bg-gray-200" />

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        to="/auth/register"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1a73e8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                        <i className="fa-solid fa-rotate-left"></i>
                        Đăng ký lại
                    </Link>
                    <Link
                        to="/auth/login"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <i className="fa-solid fa-right-to-bracket"></i>
                        Đăng nhập
                    </Link>
                </div>

                {/* Help hint */}
                <p className="mt-6 text-xs text-gray-400">
                    Nếu vấn đề vẫn tiếp diễn, hãy liên hệ{" "}
                    <a href="mailto:nguyennamduong205@gmail.com" className="text-[#1a73e8] hover:underline">
                        hỗ trợ
                    </a>
                    .
                </p>

                {/* Footer brand */}
                <p className="mt-4 text-xs text-gray-400">GMS Cloud · Dịch vụ quản lý file & URL</p>
            </div>
        </div>
    );
};

export default VerifyFailedPage;
