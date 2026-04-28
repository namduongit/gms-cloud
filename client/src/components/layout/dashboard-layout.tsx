import { Outlet } from "react-router";
import Sidebar from "../ui/sidebar/sidebar";
import Header from "../ui/header/header";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-6">
                <Header />
            </div>

            <div className="flex gap-0">
                <aside className="hidden w-56 shrink-0 border-r border-gray-100 lg:block">
                    <div className="sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto px-4 py-4">
                        <Sidebar />
                    </div>
                </aside>

                <main className="min-w-0 flex-1 px-8 py-6 pb-16">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
