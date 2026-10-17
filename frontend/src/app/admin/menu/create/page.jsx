"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Hàm gọi API tạo menu trong Laravel.
import { createMenu } from "@/services/admin/menuService";

export default function ThemMenuPage() {
    const router = useRouter();

    // Lưu thông tin menu nhập từ biểu mẫu.
    const [formData, setFormData] = useState({
    ten_menu: "",
    duong_dan_lien_ket: "",
    thu_tu: 1,
    trang_thai: 1,
});

    // Trạng thái đang gửi dữ liệu.
    const [dangLuu, setDangLuu] = useState(false);

    // Lưu thông báo lỗi nếu tạo menu thất bại.
    const [loi, setLoi] = useState("");

    // Cập nhật dữ liệu khi nhập.
    const xuLyThayDoi = (e) => {
        const { name, value } = e.target;

        setFormData((duLieuCu) => ({
            ...duLieuCu,
            [name]: value,
        }));
    };

    // Gửi dữ liệu menu đến API Laravel.
    const xuLySubmit = async (e) => {
        e.preventDefault();

        // Không gửi nhiều lần khi đang lưu.
        if (dangLuu) return;

        setDangLuu(true);
        setLoi("");

        try {
            // Chuẩn hóa dữ liệu trước khi gửi.
            const duLieu = {
                ...formData,
                thu_tu: Number(formData.thu_tu),
                trang_thai: Number(formData.trang_thai),
            };

            // Gọi API tạo menu.
            await createMenu(duLieu);

            // Chỉ quay lại danh sách khi API thành công.
            alert("Thêm menu thành công!");
            router.push("/admin/menu");
        } catch (error) {
            // Hiển thị lỗi để dễ kiểm tra API.
            console.error("Lỗi tạo menu:", error);

            setLoi(
                error?.response?.data?.message ||
                error?.message ||
                "Không thể thêm menu. Vui lòng kiểm tra API Laravel."
            );
        } finally {
            // Cho phép gửi lại nếu lưu thất bại.
            setDangLuu(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6 p-6">
            {/* Tiêu đề trang. */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Thêm menu
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Nhập thông tin menu mới.
                </p>
            </div>

            {/* Biểu mẫu tạo menu. */}
            <form
                onSubmit={xuLySubmit}
                className="space-y-5 rounded-lg bg-white p-6 shadow"
            >
                {/* Hiển thị lỗi nếu gọi API thất bại. */}
                {loi && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {loi}
                    </div>
                )}

                {/* Tên menu. */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Tên menu
                    </label>

                    <input
                        type="text"
                        name="ten_menu"
                        value={formData.ten_menu}
                        onChange={xuLyThayDoi}
                        required
                        placeholder="Ví dụ: Trang chủ"
                        className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                    />
                </div>

                {/* Đường dẫn khi nhấn menu. */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Đường dẫn
                    </label>

                    <input
                        type="text"
                        name="duong_dan_lien_ket"
                        value={formData.duong_dan}
                        onChange={xuLyThayDoi}
                        required
                        placeholder="Ví dụ: /admin"
                        className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                    />
                </div>

                {/* Thứ tự hiển thị menu. */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Thứ tự
                    </label>

                    <input
                        type="number"
                        name="thu_tu"
                        min="1"
                        value={formData.thu_tu}
                        onChange={xuLyThayDoi}
                        required
                        className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                    />
                </div>

                {/* Trạng thái menu. */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Trạng thái
                    </label>

                    <select
                        name="trang_thai"
                        value={formData.trang_thai}
                        onChange={xuLyThayDoi}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                    >
                        <option value={1}>Hiển thị</option>
                        <option value={0}>Ẩn</option>
                    </select>
                </div>

                {/* Nút thao tác. */}
                <div className="flex justify-end gap-3 border-t pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={dangLuu}
                        className="rounded-md border border-gray-300 px-5 py-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Quay lại
                    </button>

                    <button
                        type="submit"
                        disabled={dangLuu}
                        className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {dangLuu ? "Đang lưu..." : "Thêm menu"}
                    </button>
                </div>
            </form>
        </div>
    );
}