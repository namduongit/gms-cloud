export type UploadConflictStrategy = "keep_both" | "overwrite";

// Sign
export type FileMetadata = {
    client_file_id: string;
    name: string;
    size: number;
    type: string;
    conflict_strategy?: UploadConflictStrategy;
}

export type PresignUploadForm = {
    files: FileMetadata[];
    destination_uuid?: string;
}

// Presign to get URL
export type PresignUploadResponse = {
    file_name: string;
    client_file_id: string;
    session_uuid: string;
    mode: string; //  single or multipart
    reason: string;
    accepted: boolean;
    expires_at: Date;
    part_size: number;
}

// Upload - multipart
export type SignUploadResponse = {
    upload_urls: string[];
}

// Complete
export type PartComplete = {
    part_number: number;
    etag: string;
    size_bytes: number;
}

export type FileResponse = {
    uuid: string;

    file_name: string;
    content_type: string;
    size: number;
    is_shared: boolean;

    folder_uuid: string | null;
    folder_name: string;

    uploaded_at: Date;
}

export type FileListResponse = {
    owner_uuid: string;
    files: FileResponse[];
}
