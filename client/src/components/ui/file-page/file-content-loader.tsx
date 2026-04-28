interface FileContentLoaderProps {
    loading: boolean;
    isEmpty: boolean;
    children?: React.ReactNode;
}

const FileContentLoader = ({
    loading,
    isEmpty,
    children
}: FileContentLoaderProps) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-gray-400 mb-4 block"></i>
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <i className="fa-solid fa-inbox text-4xl text-gray-300 mb-4 block"></i>
                    <p className="text-gray-500">Không có file hoặc thư mục nào</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default FileContentLoader;
