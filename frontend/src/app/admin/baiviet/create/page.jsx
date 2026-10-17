"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    themBaiViet,
    getChuDeBaiViets,
} from "@/services/admin/baiVietService";

// Trang tạo bài viết mới.
export default function CreateBaiVietPage() {
    const router = useRouter();

    // Dữ liệu biểu mẫu.
    const [form, setForm] = useState({
        tieu_de: "",
        duong_dan: "",
        chu_de_id: "",
        mo_ta_ngan: "",
        noi_dung: "",
        hinh_anh_dai_dien: "",
        trang_thai: "1",
    });

    // Danh sách chủ đề lấy từ Laravel.
    const [chuDes, setChuDes] = useState([]);

    // Thông báo lỗi và trạng thái lưu.
    const [loi, setLoi] = useState("");
    const [dangLuu, setDangLuu] = useState(false);

    // Lấy danh sách chủ đề khi mở trang.
    useEffect(() => {
        getChuDeBaiViets()
            .then(setChuDes)
            .catch((error) => setLoi(error.message));
    }, []);

    // Cập nhật trường tương ứng khi nhập dữ liệu.
    function xuLyThayDoi(event) {
        const { name, value } = event.target;

        setForm((formCu) => ({
            ...formCu,
            [name]: value,
        }));
    }

    // Gửi dữ liệu tạo bài viết.
    async function xuLyLuu(event) {
        event.preventDefault();
        setLoi("");
        setDangLuu(true);

        try {
            await themBaiViet({
                ...form,
                chu_de_id: form.chu_de_id || null,
                trang_thai: Number(form.trang_thai),
            });

            alert("Thêm bài viết thành công.");
            router.push("/admin/baiviet");
        } catch (error) {
            setLoi(error.message);
        } finally {
            setDangLuu(false);
        }
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            {/* Tiêu đề và đường dẫn quay lại. */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Thêm bài viết</h1>

                <Link
                    href="/admin/baiviet"
                    className="rounded border px-4 py-2"
                >
                    Quay lại
                </Link>
            </div>

            {/* Biểu mẫu thêm bài viết. */}
            <form
                onSubmit={xuLyLuu}
                className="space-y-4 rounded border p-5"
            >
                <div>
                    <label className="mb-1 block font-medium">
                        Tiêu đề *
                    </label>
                    <input
                        name="tieu_de"
                        value={form.tieu_de}
                        onChange={xuLyThayDoi}
                        required
                        maxLength={200}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Đường dẫn
                    </label>
                    <input
                        name="duong_dan"
                        value={form.duong_dan}
                        onChange={xuLyThayDoi}
                        maxLength={220}
                        placeholder="Để trống để tạo từ tiêu đề"
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Chủ đề
                    </label>
                    <select
                        name="chu_de_id"
                        value={form.chu_de_id}
                        onChange={xuLyThayDoi}
                        className="w-full rounded border p-2"
                    >
                        <option value="">Chưa phân loại</option>

                        {chuDes.map((chuDe) => (
                            <option key={chuDe.id} value={chuDe.id}>
                                {chuDe.ten_chu_de}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Mô tả ngắn
                    </label>
                    <textarea
                        name="mo_ta_ngan"
                        value={form.mo_ta_ngan}
                        onChange={xuLyThayDoi}
                        maxLength={500}
                        rows={3}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Nội dung
                    </label>
                    <textarea
                        name="noi_dung"
                        value={form.noi_dung}
                        onChange={xuLyThayDoi}
                        rows={8}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Đường dẫn ảnh đại diện
                    </label>
                    <input
                        name="hinh_anh_dai_dien"
                        value={form.hinh_anh_dai_dien}
                        onChange={xuLyThayDoi}
                        maxLength={255}
                        placeholder="Ví dụ: https://... hoặc đường dẫn ảnh"
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Trạng thái
                    </label>
                    <select
                        name="trang_thai"
                        value={form.trang_thai}
                        onChange={xuLyThayDoi}
                        className="w-full rounded border p-2"
                    >
                        <option value="1">Đang hiển thị</option>
                        <option value="0">Đang ẩn</option>
                    </select>
                </div>

                {/* Hiển thị lỗi do API trả về. */}
                {loi && <p className="text-red-600">{loi}</p>}

                <button
                    type="submit"
                    disabled={dangLuu}
                    className="rounded bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
                >
                    {dangLuu ? "Đang lưu..." : "Lưu bài viết"}
                </button>
            </form>
        </div>
    );
}