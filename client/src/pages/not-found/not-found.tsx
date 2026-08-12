import { Link } from "react-router";
import PublicLayout from "../../components/layout/public-layout";

const NotFoundPage = () => {
    return (
        <PublicLayout>
            <div className="flex min-h-[70vh] items-center justify-center px-2 py-6">
                <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                        <div className="p-8 sm:p-10 lg:p-12">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1a73e8]">404</p>
                            <h1 className="mt-4 text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
                                Trang bạn tìm kiếm không tồn tại.
                            </h1>
                            <p className="mt-4 max-w-xl text-base text-gray-500">
                                Đường dẫn này có thể đã bị đổi, bị xóa hoặc bạn đã nhập sai. Hãy quay về trang chủ hoặc mở tài liệu để tiếp tục trải nghiệm.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#1a73e8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                >
                                    <i className="fa-solid fa-house" />
                                    Quay về trang chủ
                                </Link>
                                <Link
                                    to="/page/document"
                                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    <i className="fa-regular fa-file-lines text-gray-400" />
                                    Xem tài liệu
                                </Link>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-2 text-sm text-gray-500">
                                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">GMS Cloud</span>
                                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">File · URL · API</span>
                                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Hỗ trợ 24/7</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center p-8 sm:p-10">
                            <div className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a73e8] text-2xl font-black text-white">
                                    404
                                </div>
                                <div className="mt-5">
                                    <p className="text-sm font-semibold text-gray-900">Có vẻ bạn đang lạc đường</p>
                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        Đừng lo, hãy dùng các nút bên dưới để quay lại đúng tuyến đường.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default NotFoundPage;
