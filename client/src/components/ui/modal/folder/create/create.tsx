import { type FormEvent, useState } from "react";
import Button from "../../../button/button";

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
    loading: boolean;
}

const CreateFolderModal = ({ isOpen, onClose, onSubmit, loading }: CreateFolderModalProps) => {
    const [folderName, setFolderName] = useState("");

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(folderName);
        setFolderName("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2937]/45 px-4 py-6">
            <form
                className="flex w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between border-b border-gray-300/90 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Tạo thư mục</h3>
                        <p className="mt-1 text-sm text-gray-500">Nhập tên thư mục mới để tạo nhanh.</p>
                    </div>
                    <Button
                        className="rounded-md border border-gray-300/90 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Đóng
                    </Button>
                </div>

                <div className="space-y-4 px-6 py-5">
                    <label className="block text-sm font-semibold text-gray-900">
                        Tên thư mục
                        <input
                            type="text"
                            className="mt-2 w-full rounded-lg border border-gray-300/90 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/15"
                            placeholder="Ví dụ: Báo cáo Q2"
                            value={folderName}
                            onChange={(event) => setFolderName(event.target.value)}
                            autoFocus
                            disabled={loading}
                        />
                    </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-300/90 px-6 py-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300/90 px-4 py-1.5 text-gray-900 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        className="rounded-md bg-[#1a73e8] px-5 py-1.5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={!folderName.trim() || loading}
                    >
                        {loading ? "Đang tạo..." : "Tạo thư mục"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateFolderModal;
