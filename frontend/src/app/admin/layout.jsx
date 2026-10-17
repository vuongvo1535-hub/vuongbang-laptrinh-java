
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminFooter from "@/components/admin/AdminFooter";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-orange-50">
            <AdminHeader />

            <div className="flex min-h-[calc(100vh-120px)]">
                <AdminSidebar />

                <main className="min-h-[calc(100vh-128px)] flex-1 p-6">
                    {children}
                </main>
            </div>

            <AdminFooter />
        </div>
    );
}