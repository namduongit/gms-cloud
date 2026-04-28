import { Axios } from "../../libs/api";
import type { RestResponse } from "../../libs/response";
import type { PartComplete, PresignUploadForm, PresignUploadResponse, SignUploadResponse } from "../types/file.type";

const api = Axios();

export const UploadModule = {
    /**
        * Flow upload the file:
        * @First PresignUpload to get the session id 
        * @Second SignUpload to get the upload url
        * Then upload the file to the url with the session id as a header
        */
    async PresignUpload(data: PresignUploadForm) {
        const response = await api.
            post<RestResponse<PresignUploadResponse[]>>("/api/guard/presign-upload",
                data
            );
        return response.data;
    },

    // SignUpload for get upload URL
    async SignSingleUpload(sessionId: string) {
        const response = await api.
            post<RestResponse<SignUploadResponse>>(`/api/guard/sign-upload/${sessionId}`, {
                // is_multi: false, 
                part: []
            });
        return response.data;
    },

    async SignMultipartUpload(sessionId: string, parts: number[]) {
        const response = await api.
            post<RestResponse<SignUploadResponse>>(`/api/guard/sign-upload/${sessionId}`, {
                is_multi: true,
                parts: parts
            });
        return response.data;
    },

    // Complete upload
    /**
     * * Send with SessionUUID
     * ? Move from TMP to Final, create file and store part (Server side)
     */
    async CompleteSingleUpload(sessionId: string) {
        const response = await api.post(`/api/guard/complete-single-upload/${sessionId}`, {
            is_multi: false
        });
        return response.data;
    },

    async CompelteMultipartUpload(sessionId: string, partCompletes: PartComplete[]) {
        const response = await api.
            post(`/api/guard/complete-multipart-upload/${sessionId}`, {
                part_completes: partCompletes
            }
            );
        return response.data;
    }

}