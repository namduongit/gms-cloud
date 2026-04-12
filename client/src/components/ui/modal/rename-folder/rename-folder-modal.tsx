import { type FormEvent, useEffect, useState } from "react";
import Button from "../../button/button";

interface RenameFolderModalProps {
    isOpen: boolean;
    initialName: string;
    onClose: () => void;
    onSubmit?: (folderName: string) => boolean | void | Promise<boolean | void>;
}

const RenameFolderModal = ({ isOpen, initialName, onClose, onSubmit }: RenameFolderModalProps) => {
    const [folderName, setFolderName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFolderName(initialName);
            setIsSubmitting(false);
        }
    }, [isOpen, initialName]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextName = folderName.trim();
        if (!nextName) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await Promise.resolve(onSubmit?.(nextName));
            if (result !== false) {
                onClose();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2937]/45 px-4 py-6">
            <form
                className="flex w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between border-b border-gray-300/90 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Đổi tên thư mục</h3>
                        <p className="mt-1 text-sm text-gray-500">Nhập tên mới cho thư mục đã chọn.</p>
                    </div>
                    <Button
                        type="button"
                        className="rounded-md border border-gray-300/90 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Đóng
                    </Button>
                </div>

                <div className="space-y-4 px-6 py-5">
                    <label className="block text-sm font-semibold text-gray-900">
                        Tên thư mục mới
                        <input
                            type="text"
                            className="mt-2 w-full rounded-xl border border-gray-300/90 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/15"
                            placeholder="Ví dụ: Báo cáo Q2"
                            value={folderName}
                            onChange={(event) => setFolderName(event.target.value)}
                            autoFocus
                            disabled={isSubmitting}
                        />
                    </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-300/90 px-6 py-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300/90 px-4 py-2 text-gray-900 hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        className="rounded-md bg-[#1a73e8] px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={!folderName.trim() || folderName.trim() === initialName.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Đang lưu..." : "Lưu tên mới"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RenameFolderModal;
