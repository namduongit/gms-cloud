import { Axios } from "../../libs/api";
import type { RestResponse } from "../../libs/response";
import type { CreateFolderForm, FolderListResponse } from "../types/folder.type";
import type { FolderResponse } from "../types/folder.type";

const api = Axios();

export const FolderModule = {
    async GetFolders() {
        const response = await api.get<RestResponse<FolderListResponse>>("/api/guard/folders");
        return response.data;
    },

    async CreateFolder(data: CreateFolderForm) {
        const response = await api.post<RestResponse<FolderResponse>>("/api/guard/folders", data);
        return response.data;
    },

    async RenameFolder(folderUUID: string, name: string) {
        const response = await api.put<RestResponse<FolderResponse>>(`/api/guard/folders/${folderUUID}`, { name });
        return response.data;
    },

    async DeleteFolder(folderUUID: string) {
        const response = await api.delete<RestResponse<null>>(`/api/guard/folders/${folderUUID}`);
        return response.data;
    }
}