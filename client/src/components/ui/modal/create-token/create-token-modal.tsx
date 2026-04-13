import Button from "../../button/button";

interface CreateTokenModalProps {
    isOpen: boolean;
    publicToken: string;
    privateToken: string;
    onClose: () => void;
    onCopyToken: (token: string) => void | Promise<void>;
}

const CreateTokenModal = ({ isOpen, publicToken, privateToken, onClose, onCopyToken }: CreateTokenModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2937]/45 px-4 py-6">
            <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
                <div className="flex items-start justify-between border-b border-gray-300/90 px-6 py-4">
                    <div>
                        <h3 className="mt-2 text-2xl font-semibold text-gray-900">Lưu token ngay bây giờ</h3>
                        <p className="mt-1 text-sm text-gray-500">Public token có thể xem lại. Private token chỉ hiển thị một lần duy nhất.</p>
                    </div>
                    <Button type="button" className="rounded-md border border-gray-300/90 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50" onClick={onClose}>
                        Đóng
                    </Button>
                </div>

                <div className="space-y-4 px-6 py-5">
                    <div className="rounded-lg border border-gray-300/90 bg-gray-50/60 p-4 text-sm">
                        <p className="text-gray-500">Public token</p>
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                value={publicToken}
                                readOnly
                                className="w-full rounded-md border border-gray-300/90 bg-white px-3 py-2 font-mono text-xs text-gray-700"
                            />
                            <Button
                                type="button"
                                className="shrink-0 rounded-md border border-gray-300/90 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                onClick={() => void onCopyToken(publicToken)}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                        <p className="text-amber-900">Private token</p>
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                value={privateToken}
                                readOnly
                                className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 font-mono text-xs text-gray-700"
                            />
                            <Button
                                type="button"
                                className="shrink-0 rounded-md border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
                                onClick={() => void onCopyToken(privateToken)}
                            >
                                Copy
                            </Button>
                        </div>
                        <p className="mt-3 text-xs font-medium leading-5 text-amber-800">
                            Lưu ý: private token chỉ xuất hiện một lần duy nhất, hãy cất kĩ ngay sau khi tạo.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-300/90 px-6 py-4">
                    <Button type="button" className="rounded-md border border-gray-300/90 px-4 py-2 text-gray-900 hover:bg-gray-50" onClick={onClose}>
                        Đóng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateTokenModal;