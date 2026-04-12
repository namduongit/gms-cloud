import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlanModule } from "../../services/modules/plan.module";
import { useExecute } from "../hooks/useExecute";
import type { MyPlanUsageResponse } from "../../services/types/plan.type";
import { useAuthenticate } from "../hooks/useAuthenticate";
import { formatFileSize } from "../../services/utils/file";
import { FileModule } from "../../services/modules/file.module";
import type { FileResponse } from "../../services/types/file.type";
import { useNotificate } from "../hooks/useNotificate";

type PlanUsageContextType = {
    myPlanUsage: MyPlanUsageResponse | undefined;
    loadingPlanUsage: boolean;
    addFileToUploadQueue: (file: File | File[], folder?: string) => Promise<FileResponse[]>;
    refreshPlanUsage: () => Promise<void>;
};

type UploadQueueItem = {
    id: string;
    file: File;
    status: "pending" | "uploading" | "success" | "error";
    uploadedFile?: FileResponse;
};

const PlanUsageContext = createContext<PlanUsageContextType | undefined>(undefined);

const PlanUsageProvider = ({ children }: { children: React.ReactNode }) => {
    const { ViewPlan } = PlanModule;
    const { authConfig, checkingAuth } = useAuthenticate();
    const { showToast } = useNotificate();
    const { execute: executeViewPlan, loading: loadingPlanUsage } = useExecute<MyPlanUsageResponse>();
    const { execute: executeUploadFile } = useExecute<FileResponse>();

    const [myPlanUsage, setMyPlanUsage] = useState<MyPlanUsageResponse | undefined>(undefined);

    const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
    const [showUploadList, setShowUploadList] = useState<boolean>(false);
    const uploadChainRef = useRef<Promise<void>>(Promise.resolve());

    const totalUploadSize = useMemo(() => {
        return uploadQueue.reduce((total, item) => total + item.file.size, 0);
    }, [uploadQueue]);

    const updateUploadQueueItem = useCallback((itemId: string, patch: Partial<UploadQueueItem>) => {
        setUploadQueue((previous) =>
            previous.map((item) => (item.id === itemId ? { ...item, ...patch } : item))
        );
    }, []);

    const removeUploadQueueItem = useCallback((itemId: string) => {
        setUploadQueue((previous) => previous.filter((item) => item.id !== itemId));
    }, []);

    const refreshPlanUsage = useCallback(async () => {
        await executeViewPlan(() => ViewPlan(), {
            onSuccess: (data) => {
                setMyPlanUsage(data);
            },
            onError: () => {
                setMyPlanUsage(undefined);
            },
        });
    }, [ViewPlan, executeViewPlan]);

    const addFileToUploadQueue = useCallback((file: File | File[], folder?: string) => {
        const newFiles = Array.isArray(file) ? file : [file];
        if (newFiles.length === 0) {
            return Promise.resolve([]);
        }

        const runQueue = async () => {
            const uploadedFiles: FileResponse[] = [];

            for (const currentFile of newFiles) {
                const queueId = crypto.randomUUID?.() ?? `${Date.now()}-${currentFile.name}`;

                setUploadQueue((previous) => [
                    ...previous,
                    {
                        id: queueId,
                        file: currentFile,
                        status: "pending",
                    },
                ]);

                updateUploadQueueItem(queueId, { status: "uploading" });

                const uploadedFile = await executeUploadFile(() => FileModule.UploadFile({ file: currentFile, folder }), {
                    onSuccess: (data) => {
                        updateUploadQueueItem(queueId, {
                            status: "success",
                            uploadedFile: data,
                        });
                        showToast({
                            type: "success",
                            title: "Tải file thành công",
                            message: `${currentFile.name} đã được tải lên.`,
                        });
                    },
                    onError: () => {
                        updateUploadQueueItem(queueId, { status: "error" });
                        showToast({
                            type: "error",
                            title: "Tải file thất bại",
                            message: `${currentFile.name} chưa được tải lên.`,
                        });
                    },
                });

                if (uploadedFile) {
                    uploadedFiles.push(uploadedFile);
                }

                window.setTimeout(() => {
                    removeUploadQueueItem(queueId);
                }, 3500);
            }

            return uploadedFiles;
        };

        const nextTask = uploadChainRef.current.then(runQueue, runQueue);
        uploadChainRef.current = nextTask.then(() => undefined, () => undefined);

        return nextTask;
    }, [executeUploadFile, removeUploadQueueItem, showToast, updateUploadQueueItem]);

    useEffect(() => {
        if (checkingAuth || !authConfig) {
            return;
        }
        void refreshPlanUsage();
    }, []);

    return (
        <PlanUsageContext.Provider
            value={{
                myPlanUsage,
                loadingPlanUsage,
                refreshPlanUsage,
                addFileToUploadQueue,
            }}
        >
            {children}

            {uploadQueue.length > 0 && (
                <div className="fixed bottom-4 right-4 z-40 w-90 rounded-2xl border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.16)]">
                    <div className="border-b border-slate-100 px-4 py-3">
                        {showUploadList ? (
                            <div onClick={() => setShowUploadList(false)} className="flex cursor-pointer items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e8f0fe] text-[#1a73e8]">
                                        <i className="fa-solid fa-spinner animate-spin text-xs"></i>
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Danh sách tải lên</p>
                                        <p className="text-xs text-slate-500">{uploadQueue.length} file • {formatFileSize(totalUploadSize)}</p>
                                    </div>
                                </div>
                                <i className="fa-solid fa-angle-down text-slate-500"></i>
                            </div>
                        ) : (
                            <div onClick={() => setShowUploadList(true)} className="flex cursor-pointer items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e8f0fe] text-[#1a73e8]">
                                        <i className="fa-solid fa-spinner animate-spin text-xs"></i>
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Đang tải lên</p>
                                        <p className="text-xs text-slate-500">{uploadQueue.length} file • {formatFileSize(totalUploadSize)}</p>
                                    </div>
                                </div>
                                <i className="fa-solid fa-angle-up text-slate-500"></i>
                            </div>

                        )}
                    </div>

                    {showUploadList && (
                        <div className="max-h-72 space-y-2 overflow-y-auto px-3 py-3">
                            {uploadQueue.map((item) => {
                                const statusLabel = {
                                    pending: "Đang chờ",
                                    uploading: "Đang tải",
                                    success: "Thành công",
                                    error: "Lỗi",
                                }[item.status];

                                const statusIcon = {
                                    pending: "fa-regular fa-clock",
                                    uploading: "fa-solid fa-spinner animate-spin text-[#1a73e8]",
                                    success: "fa-solid fa-check text-emerald-600",
                                    error: "fa-solid fa-triangle-exclamation text-red-600",
                                }[item.status];

                                return (
                                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-slate-500">
                                                <i className={`${statusIcon} text-xs`}></i>
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-800">{item.file.name}</p>
                                                <p className="text-xs text-slate-500">{item.file.type || "Không xác định"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`rounded-lg px-2 py-1 text-[11px] font-semibold ${item.status === "uploading" ? "bg-blue-100 text-blue-700" : item.status === "success" ? "bg-emerald-100 text-emerald-700" : item.status === "error" ? "bg-red-100 text-red-700" : "bg-slate-200 text-slate-600"}`}>
                                                {statusLabel}
                                            </span>
                                            <span className="shrink-0 rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                                                {formatFileSize(item.file.size)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </PlanUsageContext.Provider>
    );
};

export { PlanUsageContext };
export default PlanUsageProvider;
