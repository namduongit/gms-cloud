import { useCallback, useEffect, useMemo, useState } from "react";
import PlanCard from "../../components/ui/plan-card/plan-card";
import { PlanModule } from "../../services/modules/plan.module";
import { useExecute } from "../../common/hooks/useExecute";
import type { PlanListResponse, PlanResponse } from "../../services/types/plan.type";
import { useAuthenticate } from "../../common/hooks/useAuthenticate";
import { formatFileSize } from "../../services/utils/file";

const formatPrice = (price: number) => {
    if (price <= 0) {
        return "Miễn phí";
    }
    return `${price.toLocaleString("vi-VN")} VND`;
};

const formatStorageLimit = (value: number) => {
    if (value <= 0) {
        return "Không giới hạn lưu trữ";
    }
    return `${formatFileSize(value)} lưu trữ`;
};

// Tính phần trăm dung lượng đã dùng, giới hạn trong khoảng [0, 100].
// Trả về null khi không xác định được (ví dụ gói không giới hạn / total_bytes <= 0).
const getStoragePercent = (used: number, total: number): number | null => {
    if (!total || total <= 0) {
        return null;
    }
    const percent = (used / total) * 100;
    return Math.min(100, Math.max(0, percent));
};

const getStorageBarColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-amber-500";
    return "bg-blue-500";
};

const FAQ_ITEMS = [
    {
        question: "Tôi có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào không?",
        answer: "Có. Bạn có thể liên hệ đội ngũ hỗ trợ để thay đổi gói bất cứ lúc nào, phần dung lượng và các tính năng sẽ được cập nhật ngay sau khi gói mới có hiệu lực.",
    },
    {
        question: "Điều gì xảy ra nếu dung lượng của tôi vượt quá giới hạn gói?",
        answer: "Bạn vẫn có thể xem và tải các tệp hiện có, nhưng sẽ không thể tải lên tệp mới cho đến khi giải phóng dung lượng hoặc nâng cấp lên gói cao hơn.",
    },
    {
        question: "Gói dịch vụ có tự động gia hạn không?",
        answer: "Có, các gói trả phí sẽ tự động gia hạn theo chu kỳ trừ khi bạn hủy trước ngày gia hạn tiếp theo.",
    },
];

const PlanPage = () => {
    const { authConfig } = useAuthenticate();
    const usage = authConfig?.usage;
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const currentPlan = {
        uuid: usage?.plan_uuid ?? "",
        name: authConfig?.plan_name ?? "",
    };

    const { GetPlans } = PlanModule;
    const { execute, loading } = useExecute<PlanListResponse>();
    const [plans, setPlans] = useState<PlanResponse[]>([]);

    const loadPlans = useCallback(async () => {
        await execute(() => GetPlans(), {
            onSuccess: (data) => {
                if (Array.isArray(data)) {
                    setPlans(data);
                    return;
                }
                setPlans([]);
            },
            onError: () => {
                setPlans([]);
            },
        });
    }, []);

    useEffect(() => {
        void loadPlans();
    }, [loadPlans]);

    const planCards = useMemo(() => {
        return plans.map((plan) => {
            const isCurrentPlan = Boolean(
                plan.uuid === currentPlan.uuid ||
                plan.name.toLowerCase() === currentPlan.name.toLowerCase()
            );

            return {
                key: plan.uuid,
                title: plan.name,
                price: formatPrice(plan.price),
                description: `Gói ${plan.name} cho nhu cầu lưu trữ và chia sẻ tệp.`,
                features: [formatStorageLimit(plan.storage_limit)],
                highlight: isCurrentPlan,
                isCurrentPlan,
            };
        });
    }, [plans, currentPlan.uuid, currentPlan.name]);

    const comparisonRows = useMemo(() => {
        return [...plans]
            .sort((a, b) => a.price - b.price)
            .map((plan) => {
                const isCurrentPlan = Boolean(
                    plan.uuid === currentPlan.uuid ||
                    plan.name.toLowerCase() === currentPlan.name.toLowerCase()
                );
                return {
                    key: plan.uuid,
                    name: plan.name,
                    price: formatPrice(plan.price),
                    storage: formatStorageLimit(plan.storage_limit),
                    isCurrentPlan,
                };
            });
    }, [plans, currentPlan.uuid, currentPlan.name]);

    const usedStorage = usage?.used_storage ?? 0;
    const totalStorage = usage?.total_bytes ?? 0;
    const storagePercent = useMemo(
        () => getStoragePercent(usedStorage, totalStorage),
        [usedStorage, totalStorage]
    );

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Gói dịch vụ</h1>
                    <p className="mt-0.5 text-sm text-gray-500">Theo dõi mức sử dụng và so sánh các gói.</p>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Gói hiện tại</p>
                    <p className="mt-1.5 text-base font-semibold text-gray-900">{currentPlan.name || "—"}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Dung lượng</p>
                        {storagePercent !== null && (
                            <span className="text-xs font-medium text-gray-500">
                                {storagePercent.toFixed(0)}%
                            </span>
                        )}
                    </div>
                    <p className="mt-1.5 text-base font-semibold text-gray-900">
                        {formatFileSize(usedStorage)} / {totalStorage > 0 ? formatFileSize(totalStorage) : "Không giới hạn"}
                    </p>
                    {storagePercent !== null && (
                        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${getStorageBarColor(storagePercent)}`}
                                style={{ width: `${storagePercent}%` }}
                                role="progressbar"
                                aria-valuenow={Math.round(storagePercent)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h2 className="mb-3 text-sm font-semibold text-gray-700">Tất cả gói</h2>
                <div className="grid gap-4 lg:grid-cols-3">
                    {!loading && planCards.length === 0 && (
                        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-sm text-gray-400 lg:col-span-3">
                            Chưa có dữ liệu gói dịch vụ.
                        </div>
                    )}
                    {planCards.map((plan) => (
                        <PlanCard
                            key={plan.key}
                            title={plan.title}
                            price={plan.price}
                            description={plan.description}
                            features={plan.features}
                            highlight={plan.highlight}
                            actionLabel={plan.isCurrentPlan ? "Gói hiện tại" : "Liên hệ nâng cấp"}
                        />
                    ))}
                </div>
            </div>

            {comparisonRows.length > 0 && (
                <div>
                    <h2 className="mb-3 text-sm font-semibold text-gray-700">So sánh chi tiết</h2>
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-2.5 font-medium text-gray-500">Gói</th>
                                    <th className="px-4 py-2.5 font-medium text-gray-500">Giá</th>
                                    <th className="px-4 py-2.5 font-medium text-gray-500">Dung lượng</th>
                                    <th className="px-4 py-2.5 font-medium text-gray-500"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row) => (
                                    <tr
                                        key={row.key}
                                        className={`border-b border-gray-100 last:border-b-0 ${
                                            row.isCurrentPlan ? "bg-blue-50/60" : ""
                                        }`}
                                    >
                                        <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                                        <td className="px-4 py-2.5 text-gray-700">{row.price}</td>
                                        <td className="px-4 py-2.5 text-gray-700">{row.storage}</td>
                                        <td className="px-4 py-2.5">
                                            {row.isCurrentPlan && (
                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                    Đang dùng
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div>
                <h2 className="mb-3 text-sm font-semibold text-gray-700">Câu hỏi thường gặp</h2>
                <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
                    {FAQ_ITEMS.map((item, index) => {
                        const isOpen = openFaqIndex === index;
                        return (
                            <div key={item.question} className="px-4">
                                <button
                                    type="button"
                                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                    className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-gray-900"
                                >
                                    <span>{item.question}</span>
                                    <span
                                        className={`ml-3 shrink-0 text-gray-400 transition-transform duration-200 ${
                                            isOpen ? "rotate-45" : ""
                                        }`}
                                    >
                                        +
                                    </span>
                                </button>
                                {isOpen && (
                                    <p className="pb-3.5 text-sm leading-relaxed text-gray-500">{item.answer}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlanPage;