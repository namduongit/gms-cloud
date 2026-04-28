import { useCallback, useEffect, useState } from "react";
import { useExecute } from "../../../common/hooks/useExecute";
import { useNotificate } from "../../../common/hooks/useNotificate";
import type { FileResponse } from "../../../services/types/file.type";
import type { FolderResponse } from "../../../services/types/folder.type";
import { FileModule } from "../../../services/modules/file.module";
import { FolderModule } from "../../../services/modules/folder.module";
import Button from "../button/button";

interface FileActionsProps {
    file?: FileResponse;
    folder?: FolderResponse;
    isOpen: boolean;
    position: { x: number; y: number };
    onClose: () => void;
    onShare?: (file: FileResponse) => void;
    onDownload?: (file: FileResponse) => void;
    onDelete?: (file: FileResponse) => void;
    onRename?: (folder: FolderResponse) => void;
    onDeleteFolder?: (folder: FolderResponse) => void;
}

const FileActions = ({
    file,
    folder,
    isOpen,
    position,
    onClose,
    onShare,
    onDownload,
    onDelete,
    onRename,
    onDeleteFolder
}: FileActionsProps) => {
    const { showToast } = useNotificate();
    const [ref, setRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref && !ref.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, ref, onClose]);

    if (!isOpen) return null;

    const handleShare = () => {
        if (file) {
            onShare?.(file);
            onClose();
        }
    };

    const handleDownload = () => {
        if (file) {
            onDownload?.(file);
            onClose();
        }
    };

    const handleDelete = () => {
        if (file) {
            const confirm = window.confirm(`Bạn có chắc muốn xóa ${file.file_name}?`);
            if (confirm) {
                onDelete?.(file);
                onClose();
            }
        }
    };

    const handleRename = () => {
        if (folder) {
            onRename?.(folder);
            onClose();
        }
    };

    const handleDeleteFolder = () => {
        if (folder) {
            const confirm = window.confirm(`Bạn có chắc muốn xóa thư mục ${folder.name}?`);
            if (confirm) {
                onDeleteFolder?.(folder);
                onClose();
            }
        }
    };

    return (
        <div
            ref={setRef}
            className="absolute z-50 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
            }}
        >
            {file && (
                <>
                    {file.is_shared ? (
                        <Button
                            className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition border-b border-gray-100"
                            onClick={handleShare}
                        >
                            <i className="fa-solid fa-link text-gray-400"></i>
                            Đang chia sẻ
                        </Button>
                    ) : (
                        <Button
                            className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition border-b border-gray-100"
                            onClick={handleShare}
                        >
                            <i className="fa-solid fa-share-nodes text-gray-400"></i>
                            Chia sẻ
                        </Button>
                    )}
                    <Button
                        className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition border-b border-gray-100"
                        onClick={handleDownload}
                    >
                        <i className="fa-solid fa-download text-gray-400"></i>
                        Tải xuống
                    </Button>
                    <Button
                        className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition"
                        onClick={handleDelete}
                    >
                        <i className="fa-solid fa-trash text-red-400"></i>
                        Xóa
                    </Button>
                </>
            )}
            {folder && (
                <>
                    <Button
                        className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition border-b border-gray-100"
                        onClick={handleRename}
                    >
                        <i className="fa-solid fa-pen-to-square text-gray-400"></i>
                        Sửa tên
                    </Button>
                    <Button
                        className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition"
                        onClick={handleDeleteFolder}
                    >
                        <i className="fa-solid fa-trash text-red-400"></i>
                        Xóa thư mục
                    </Button>
                </>
            )}
        </div>
    );
};

export default FileActions;
