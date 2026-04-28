import type { FileResponse } from "../../../services/types/file.type";
import type { FolderResponse } from "../../../services/types/folder.type";
import SideFile from "../sidefile/sidefile";

interface FilePreviewSectionProps {
    selectedPreviewImage: FileResponse | null;
    folders: FolderResponse[];
    onClose: () => void;
    onFileDeleted: () => void;
}

const FilePreviewSection = ({
    selectedPreviewImage,
    folders,
    onClose,
    onFileDeleted
}: FilePreviewSectionProps) => {
    if (!selectedPreviewImage) {
        return null;
    }

    const resolveFolderName = (file: FileResponse) => {
        if (!file.folder_uuid) return "GMS Cloud";
        const folder = folders.find((f) => f.uuid === file.folder_uuid);
        return folder ? `GMS Cloud > ${folder.name}` : "GMS Cloud";
    };

    return (
        <SideFile
            file={selectedPreviewImage}
            onClose={onClose}
            onFileDeleted={onFileDeleted}
            resolveFileFolderName={resolveFolderName}
        />
    );
};

export default FilePreviewSection;
