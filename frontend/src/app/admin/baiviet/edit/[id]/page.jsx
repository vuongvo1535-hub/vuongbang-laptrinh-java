"use client";

// Import thư viện và cấu hình đã có
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// Sử dụng hàm tạo slug đã có trong dự án
import { taoSlug } from "@/utils/slug";

// Sử dụng các hàm gọi API bài viết đã có
import {
    getBaiViet,
    getChuDeBaiViets,
    capNhatBaiViet,
} from "@/services/admin/baiVietService";

// Sử dụng cấu hình API hiện tại để hiển thị ảnh
import API_CONFIG from "@/config/api";

// Lấy địa chỉ máy chủ từ cấu hình, bỏ phần /api ở cuối
const MAY_CHU = API_CONFIG.BASE_URL.replace(/\/api\/?$/, "");

// Tạo đường dẫn ảnh đại diện từ đường dẫn được lưu trong cơ sở dữ liệu
function layDuongDanAnh(duongDan) {
    if (!duongDan) return "";

    // Nếu đã là URL đầy đủ thì giữ nguyên
    if (/^https?:\/\//i.test(duongDan)) {
        return duongDan;
    }

    // Ghép đường dẫn tương đối với thư mục storage
    return `${MAY_CHU}/storage/${duongDan.replace(/^\/+/, "")}`;
}

export default function SuaBaiVietPage() {
    // Lấy ID bài viết từ URL
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    // Dữ liệu biểu mẫu chỉnh sửa bài viết
    const [form, setForm] = useState({
        tieu_de: "",
        duong_dan: "",
        chu_de_id: "",
        mo_ta_ngan: "",
        noi_dung: "",
        hinh_anh_dai_dien: "",
        trang_thai: "1",
    });

    // Danh sách chủ đề lấy từ API
    const [chuDes, setChuDes] = useState([]);

    // Trạng thái tải dữ liệu và lưu dữ liệu
    const [dangTai, setDangTai] = useState(true);
    const [dangLuu, setDangLuu] = useState(false);

    // Thông báo lỗi
    const [loi, setLoi] = useState("");

    // Lấy thông tin bài viết và danh sách chủ đề
    useEffect(() => {
        let daHuy = false;

        async function taiDuLieu() {
            try {
                // Gọi hai API song song bằng service hiện có
                const [baiViet, danhSachChuDe] = await Promise.all([
                    getBaiViet(id),
                    getChuDeBaiViets(),
                ]);

                // Không cập nhật state nếu trang đã bị rời đi
                if (daHuy) return;

                // Đưa dữ liệu bài viết hiện tại vào biểu mẫu
                setForm({
                    tieu_de: baiViet.tieu_de || "",
                    duong_dan: baiViet.duong_dan || "",
                    chu_de_id:
                        baiViet.chu_de_id != null
                            ? String(baiViet.chu_de_id)
                            : "",
                    mo_ta_ngan: baiViet.mo_ta_ngan || "",
                    noi_dung: baiViet.noi_dung || "",
                    hinh_anh_dai_dien:
                        baiViet.hinh_anh_dai_dien || "",
                    trang_thai: String(baiViet.trang_thai ?? 1),
                });

                // Hỗ trợ API trả về mảng trực tiếp hoặc đối tượng có thuộc tính data
                const danhSach = Array.isArray(danhSachChuDe)
                    ? danhSachChuDe
                    : danhSachChuDe?.data;

                setChuDes(Array.isArray(danhSach) ? danhSach : []);
            } catch (error) {
                // Hiển thị lỗi khi không tải được dữ liệu
                if (!daHuy) {
                    setLoi(
                        error.message || "Không thể tải dữ liệu bài viết."
                    );
                }
            } finally {
                // Kết thúc trạng thái tải dữ liệu
                if (!daHuy) {
                    setDangTai(false);
                }
            }
        }

        // Chỉ tải dữ liệu khi đã có ID bài viết
        // Chỉ tải dữ liệu khi URL có ID bài viết
        if (id) {
            taiDuLieu();
        }

        // Dọn dẹp khi rời khỏi trang
        return () => {
            daHuy = true;
        };
    }, [id]);

    // Xử lý thay đổi dữ liệu trong biểu mẫu
    function xuLyThayDoi(event) {
        const { name, value } = event.target;

        setForm((duLieuCu) => {
            const duLieuMoi = {
                ...duLieuCu,
                [name]: value,
            };

            // Tự tạo slug khi tiêu đề thay đổi
            // Dùng đúng tên hàm taoSlug từ file src/utils/slug.js
            if (name === "tieu_de") {
                duLieuMoi.duong_dan = taoSlug(value);
            }

            return duLieuMoi;
        });

        // Xóa lỗi cũ khi người dùng sửa thông tin
        setLoi("");
    }

    // Gửi dữ liệu cập nhật bài viết lên Laravel
    async function xuLyLuu(event) {
        event.preventDefault();

        setLoi("");
        setDangLuu(true);

        try {
            // Chuẩn hóa dữ liệu trước khi gửi API
            const duLieu = {
                ...form,
                chu_de_id: form.chu_de_id
                    ? Number(form.chu_de_id)
                    : null,
                trang_thai: Number(form.trang_thai),
            };

            // Gọi service cập nhật bài viết theo ID
            await capNhatBaiViet(id, duLieu);

            // Quay lại danh sách sau khi cập nhật thành công
            router.push("/admin/baiviet");
            router.refresh();
        } catch (error) {
            // Hiển thị lỗi nếu cập nhật thất bại
            setLoi(error.message || "Không thể cập nhật bài viết.");
        } finally {
            // Cho phép thao tác lại sau khi lưu xong
            setDangLuu(false);
        }
    }

    // Hiển thị trong lúc tải dữ liệu bài viết
    if (dangTai) {
        return (
            <div className="p-6 text-gray-600">
                Đang tải dữ liệu bài viết...
            </div>
        );
    }

    // Hiển thị lỗi nếu không tải được bài viết
    if (loi && !form.tieu_de) {
        return (
            <div className="p-6">
                <p className="mb-4 text-red-600">{loi}</p>

                <Link
                    href="/admin/baiviet"
                    className="text-blue-600 hover:underline"
                >
                    ← Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Tiêu đề trang và nút quay lại */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Sửa bài viết
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Đang chỉnh sửa bài viết #{id}
                    </p>
                </div>

                <Link
                    href="/admin/baiviet"
                    className="rounded-lg border bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                    ← Quay lại danh sách
                </Link>
            </div>

            {/* Biểu mẫu chỉnh sửa bài viết */}
            <form
                onSubmit={xuLyLuu}
                className="space-y-6 rounded-lg border bg-white p-5 shadow-sm md:p-6"
            >
                {/* Hiển thị thông báo lỗi */}
                {loi && (
                    <div className="rounded-lg bg-red-50 p-3 text-red-700">
                        {loi}
                    </div>
                )}

                {/* Nhập tiêu đề bài viết */}
                <div>
                    <label
                        htmlFor="tieu_de"
                        className="mb-2 block font-medium text-gray-700"
                    >
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="tieu_de"
                        name="tieu_de"
                        value={form.tieu_de}
                        onChange={xuLyThayDoi}
                        required
                        maxLength={200}
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="Nhập tiêu đề bài viết"
                    />
                </div>

                {/* Chỉnh sửa đường dẫn slug */}
                <div>
                    <label
                        htmlFor="duong_dan"
                        className="mb-2 block font-medium text-gray-700"
                    >
                        Đường dẫn (slug)
                    </label>

                    <input
                        id="duong_dan"
                        name="duong_dan"
                        value={form.duong_dan}
                        onChange={xuLyThayDoi}
                        maxLength={220}
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="duong-dan-bai-viet"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                        Slug tự tạo khi sửa tiêu đề; bạn vẫn có thể chỉnh trực tiếp.
                    </p>
                </div>

                {/* Chọn chủ đề bài viết */}
                <div>
                    <label
                        htmlFor="chu_de_id"
                        className="mb-2 block font-medium text-gray-700"
                    >
                        Chủ đề
                    </label>

                    <select
                        id="chu_de_id"
                        name="chu_de_id"
                        value={form.chu_de_id}
                        onChange={xuLyThayDoi}
                        className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-blue-500"
                    >
                        <option value="">-- Chưa chọn chủ đề --</option>

                        {chuDes.map((chuDe) => (
                            <option key={chuDe.id} value={chuDe.id}>
                                {chuDe.ten_chu_de}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Nhập mô tả ngắn */}
                <div>
                    <label
                        htmlFor="mo_ta_ngan"
                        className="mb-2 block font-medium text-gray-700"
                    >
                        Mô tả ngắn
                    </label>

                    <textarea
                        id="mo_ta_ngan"
                        name="mo_ta_ngan"
                        value={form.mo_ta_ngan}
                        onChange={xuLyThayDoi}
                        maxLength={500}
                        rows={3}
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="Nhập mô tả ngắn"
                    />
                </div>

                {/* Nhập nội dung bài viết */}
                <div>
                    <label
                        htmlFor="noi_dung"
                        className="mb-2 block font-medium text-gray-700"
                    >
                        Nội dung
                    </label>

                    <textarea
                        id="noi_dung"
                        name="noi_dung"
                        value={form.noi_dung}
                        onChange={xuLyThayDoi}
                        rows={10}
                        className="w-full rounded-lg border px-4 py-3 leading-7 outline-none focus:border-blue-500"
                        placeholder="Nhập nội dung bài viết"
                    />
                </div>

                {/* Nhập đường dẫn ảnh đại diện */}
                <div>
                    <label
                        htmlFor="hinh_anh_dai_dien"
                        className="mb-2 block font-medium text-gray-700"
                    >
                        Đường dẫn ảnh đại diện
                    </label>

                    <input
                        id="hinh_anh_dai_dien"
                        name="hinh_anh_dai_dien"
                        value={form.hinh_anh_dai_dien}
                        onChange={xuLyThayDoi}
                        maxLength={255}
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="posts/bai-viet-01.jpg"
                    />

                    {/* Xem trước ảnh đại diện */}
                    {form.hinh_anh_dai_dien && (
                        <div className="mt-3">
                            <p className="mb-2 text-sm text-gray-500">
                                Xem trước ảnh
                            </p>

                            <Image
                                src={layDuongDanAnh(form.hinh_anh_dai_dien)}
                                alt="Ảnh đại diện bài viết"
                                width={800}
                                height={500}
                                unoptimized
                                className="max-h-64 w-auto rounded-lg border object-contain"
                            />
                        </div>
                    )}
                </div>

                {/* Chọn trạng thái bài viết */}
                <div>
                    <label
                        htmlFor="trang_thai"
                        className="mb-2 block font-medium text-gray-700"
                    >
                        Trạng thái
                    </label>

                    <select
                        id="trang_thai"
                        name="trang_thai"
                        value={form.trang_thai}
                        onChange={xuLyThayDoi}
                        className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-blue-500"
                    >
                        <option value="1">Đang hiển thị</option>
                        <option value="0">Đang ẩn</option>
                    </select>
                </div>

                {/* Nút lưu và hủy chỉnh sửa */}
                <div className="flex flex-wrap gap-3 border-t pt-5">
                    <button
                        type="submit"
                        disabled={dangLuu}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {dangLuu ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>

                    <Link
                        href="/admin/baiviet"
                        className="rounded-lg border px-6 py-3 text-gray-700 hover:bg-gray-100"
                    >
                        Hủy
                    </Link>
                </div>
            </form>
        </div>
    );
}