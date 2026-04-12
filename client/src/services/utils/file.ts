import excelIcon from "../../assets/icons/excel-icon.png";
import docIcon from "../../assets/icons/doc-icon.png";
import pdfIcon from "../../assets/icons/pdf-icon.png";
import imageIcon from "../../assets/icons/image-icon.png";
import zipIcon from "../../assets/icons/zip-icon.png";

import fileIcon from "../../assets/icons/file-icon.png";

export const formatFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`;
    }
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export const getIconForFileType = (contentType: string) => {
    if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return docIcon;
    }
    if (contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        return excelIcon;
    }
    if (contentType === "application/pdf") {
        return pdfIcon;
    }
    if (contentType === "application/zip" || contentType === "application/gzip") {
        return zipIcon;
    }
    if (contentType.startsWith("image/")) {
        return imageIcon;
    }

    return fileIcon;
}