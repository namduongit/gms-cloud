import Button from "../button/button";

interface UrlPageHeroProps {
    onOpenCreate: () => void;
}

const UrlPageHero = ({ onOpenCreate }: UrlPageHeroProps) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">Short URL</h1>
                <p className="mt-0.5 text-sm text-gray-500">Tạo và quản lý link rút gọn của bạn.</p>
            </div>

            <Button
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={onOpenCreate}
            >
                <i className="fa-solid fa-plus text-xs" />
                Tạo URL mới
            </Button>
        </div>
    );
};

export default UrlPageHero;
