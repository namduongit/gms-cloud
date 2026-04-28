import type { FileResponse } from "./file.type";

export type CreateFolderForm = {
    name: string;
}

export type FolderResponse = {
    uuid: string;
    
    name: string;
    total_files: number;
    total_size: number;

    created_at: Date;
}

export type FolderListResponse = {
    owner_uuid: string;
    folders: FolderResponse[];
}

export type FolderDetailResponse = {
    owner_uuid: string;
    folder: FolderResponse;
    files: FileResponse[];
}
