import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { SignUploadResponse, FileListResponse, FileMetadata, FileResponse, PartComplete, PresignUploadForm, PresignUploadResponse } from "../../services/types/file.type";
import type { FolderDetailResponse, FolderListResponse, FolderResponse } from "../../services/types/folder.type";

import FileToolbar from "../../components/ui/file-page/file-toolbar";
import FilePreviewSection from "../../components/ui/file-page/file-preview-section";
import FileListSection from "../../components/ui/file-page/file-list-section";

import CreateFolderModal from "../../components/ui/modal/folder/create/create";
import RenameFolderModal from "../../components/ui/modal/folder/rename/rename";
import CreateFileModal from "../../components/ui/modal/file/create/create";

import { FolderModule } from "../../services/modules/folder.module";
import { FileModule } from "../../services/modules/file.module";
import { UploadModule } from "../../services/modules/upload.module";
import { useExecute } from "../../common/hooks/useExecute";
import { useNotificate } from "../../common/hooks/useNotificate";
import { v4 } from "uuid";
import axios from "axios";

const FilePage = () => {
    const { folderUUID } = useParams<{ folderUUID: string }>();
    const navigate = useNavigate();

    const { executeWithDeclareResponse, loading } = useExecute();
    const { executeWithDeclareResponse: executeApi } = useExecute();

    const { showToast, showAlert } = useNotificate();

    const { GetFolders, GetFolderByUuid, CreateFolder, RenameFolder } = FolderModule;
    const { GetFiles } = FileModule;
    const {
        PresignUpload,
        SignSingleUpload, SignMultipartUpload,
        CompleteSingleUpload, CompelteMultipartUpload
    } = UploadModule;

    const [files, setFiles] = useState<FileResponse[]>([]);
    const [folders, setFolders] = useState<FolderResponse[]>([]);
    const [folderPath, setFolderPath] = useState<FolderResponse[]>([]);

    const fetchData = useCallback(async () => {
        if (!folderUUID) {
            await Promise.all([
                executeWithDeclareResponse<FileListResponse>(() => GetFiles(), {
                    onSuccess: (data) => {
                        const files = data.files.filter((f: any) => f.folder_uuid == null);
                        setFiles(files);
                    },
                }),
                executeWithDeclareResponse<FolderListResponse>(() => GetFolders(), {
                    onSuccess: (data) => setFolders(data?.folders || []),
                }),
            ]);
            return;
        }

        await executeWithDeclareResponse<FolderDetailResponse>(() => GetFolderByUuid(folderUUID), {
            onSuccess: (data) => {
                setFiles(data.files || []);
                setFolderPath(data.folder ? [data.folder] : []);
            },
        });
    }, [folderUUID]);

    useEffect(() => {
        setFiles([]);
        setFolders([]);
        setFolderPath([]);
        fetchData();
    }, [folderUUID]);

    // Modal states
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isRenameFolderOpen, setIsRenameFolderOpen] = useState(false);

    const handleCreateFolder = async (name: string) => {
        await executeApi(() => CreateFolder({ name }), {
            onSuccess: (data) => {
                setFolders((prev) => [...prev, data]);
                setIsCreateFolderOpen(false);
                showToast({ type: "success", title: "Thành công", message: "Tạo thư mục thành công" });
            },
        });
    }

    const handleRenameFolder = async (uuid: string, name: string) => {
        await executeApi(() => RenameFolder(uuid, name), {
            onSuccess: (data) => {
                setFolders((prev) => prev.map((f) => (f.uuid === data.uuid ? data : f)));
                if (folderPath.length > 0 && folderPath[folderPath.length - 1].uuid === data.uuid) {
                    setFolderPath((prev) => [...prev.slice(0, -1), data]);
                }
                setIsRenameFolderOpen(false);
                showToast({ type: "success", title: "Thành công", message: "Đổi tên thư mục thành công" });
            },
        });
    }

    const [isCreateFileOpen, setIsCreateFileOpen] = useState(false);

    const handleUploadFiles = async (files: File[]) => {
        const mapFiles: Record<string, File> = {};
        const presignUploadData: PresignUploadForm = {} as PresignUploadForm;
        const fileMetadatas: FileMetadata[] = files.map((file) => {
            const client_file_id = v4();
            mapFiles[client_file_id] = file;
            return {
                client_file_id,   // reuse same UUID — bug fix
                name: file.name,
                size: file.size,
                type: file.type,
            };
        });

        presignUploadData.files = fileMetadatas;
        if (folderUUID) {
            presignUploadData.destination_uuid = folderUUID;
        }

        const presignResponse = await executeApi<PresignUploadResponse[]>(
            () => PresignUpload(presignUploadData)
        );

        if (!presignResponse) {
            showAlert({
                title: "Lỗi tải lên",
                message: "Có lỗi xảy ra khi tải dữ liệu lên. Vui lòng thử lại sau."
            });
            return;
        }

        presignResponse.forEach((pres) => handleUploadFile(mapFiles[pres.client_file_id], pres));

        showToast({
            type: "success",
            title: "Thành công",
            message: "Các tệp đã tải lên thành công. Vui lòng kiểm tra."
        });
        setIsCreateFileOpen(false);
    }

    const handleUploadFile = async (file: File, presignData: PresignUploadResponse) => {
        if (!presignData.accepted) {
            showToast({
                type: "error",
                title: "Không thể tải lên",
                message: `${presignData.file_name}: ${presignData.reason}`,
            });
            return;
        }

        if (presignData.mode === "single") {
            const signResponse = await executeApi<SignUploadResponse>(
                () => SignSingleUpload(presignData.session_uuid)
            );

            if (!signResponse) return;

            await axios.request({
                method: "PUT",
                url: signResponse.upload_urls[0],
                data: file,
            });

            await executeApi(() => CompleteSingleUpload(presignData.session_uuid), {
                onSuccess(data) {
                    setFiles(prev => [...prev, data]);
                },
            });

        } else if (presignData.mode === "multipart") {
            const partSize = presignData.part_size;
            const totalParts = Math.ceil(file.size / partSize);
            const partNumbers = Array.from({ length: totalParts }, (_, i) => i + 1);

            // Sign tất cả parts một lần → nhận upload_urls[0..N-1]
            const signResponse = await executeApi<SignUploadResponse>(
                () => SignMultipartUpload(presignData.session_uuid, partNumbers)
            );

            if (!signResponse) return;

            // Upload song song từng part, thu thập ETag
            const partCompletes: PartComplete[] = [];

            await Promise.all(
                partNumbers.map(async (partNumber, index) => {
                    const start = index * partSize;
                    const end = Math.min(start + partSize, file.size);
                    const chunk = file.slice(start, end);

                    const res = await axios.request({
                        method: "PUT",
                        url: signResponse.upload_urls[index],
                        data: chunk,
                        headers: { "Content-Type": file.type },
                    });

                    // S3 trả ETag trong header
                    const etag = (res.headers["etag"] as string | undefined) ?? "";
                    partCompletes[index] = {
                        part_number: partNumber,
                        etag: etag.replace(/"/g, ""),
                        size_bytes: end - start,
                    };
                })
            );

            // Hoàn tất multipart upload
            await executeApi(() => CompelteMultipartUpload(presignData.session_uuid, partCompletes), {
                onSuccess(data) {
                    setFiles(prev => [...prev, data]);
                },
            });
        }
    }

    // Selected items
    const [selectedPreviewImage, setSelectedPreviewImage] = useState<FileResponse | null>(null);
    const [targetRenameFolder, setTargetRenameFolder] = useState<FolderResponse | null>(null);

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <FileToolbar
                currentFolderPath={folderPath}
                onNavigateToRoot={() => { if (folderUUID) navigate("/page/files"); }}
                onNavigateToFolder={(folder) => navigate(`/page/files/${folder.uuid}`)}
                onCreateFolder={() => setIsCreateFolderOpen(true)}
                onUploadFiles={() => setIsCreateFileOpen(true)}
            />

            {/* Content + preview */}
            <div className={`grid gap-4 ${selectedPreviewImage ? "lg:grid-cols-[1fr_20rem]" : ""}`}>
                <FileListSection
                    files={files}
                    folders={folders}
                    loading={loading}
                    onOpenFolder={(folder) => navigate(`/page/files/${folder.uuid}`)}
                    onRenameFolder={(folder) => {
                        setTargetRenameFolder(folder);
                        setIsRenameFolderOpen(true);
                    }}
                    onShareFile={() => { }}
                    onPreviewImage={(file) => {
                        if (file.content_type?.startsWith("image/")) setSelectedPreviewImage(file);
                    }}
                />

                <FilePreviewSection
                    selectedPreviewImage={selectedPreviewImage}
                    folders={folders}
                    onClose={() => setSelectedPreviewImage(null)}
                    onFileDeleted={() => setSelectedPreviewImage(null)}
                />
            </div>

            {/* Folder Action Modals */}
            <CreateFolderModal
                isOpen={isCreateFolderOpen}
                onClose={() => setIsCreateFolderOpen(false)}
                onSubmit={handleCreateFolder}
                loading={loading}
            />

            <RenameFolderModal
                isOpen={isRenameFolderOpen}
                initialName={targetRenameFolder?.name ?? ""}
                folderUUID={targetRenameFolder?.uuid ?? ""}
                onClose={() => { setIsRenameFolderOpen(false); setTargetRenameFolder(null); }}
                onSubmit={handleRenameFolder}
                loading={loading}
            />

            {/* File Action Modals */}
            <CreateFileModal
                isOpen={isCreateFileOpen}
                onClose={() => setIsCreateFileOpen(false)}
                onSubmit={handleUploadFiles}
                destinationLabel={folderPath.length > 0 ? `GMS Cloud › ${folderPath[0].name}` : "GMS Cloud"}
            />
        </div>
    );
};

export default FilePage;