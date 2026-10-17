"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSanPham } from "@/services/admin/sanPhamService";
import { getDanhMucs } from "@/services/admin/danhMucService";
import { getThuongHieus } from "@/services/admin/thuongHieuService";
import { taoSlug } from "@/utils/slug";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL || "http://127.0.0.1:8000/storage/";

const layAnh = (path) =>
  path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;

// Hien thong bao loi (Laravel tra ve mang) duoi o nhap
const Loi = ({ loi }) =>
  loi ? (
    <p className="text-red-500 text-xs mt-1">
      {Array.isArray(loi) ? loi[0] : loi}
    </p>
  ) : null;

export default function CreateSanPhamPage() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [danhMucs, setDanhMucs] = useState([]);
  const [thuongHieus, setThuongHieus] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    ten_san_pham: "",
    duong_dan: "",
    danh_muc_id: "",
    thuong_hieu_id: "",
    gia: "",
    gia_khuyen_mai: "",
    so_luong_ton: 0,
    hinh_anh_dai_dien: "",
    mo_ta_ngan: "",
    mo_ta_chi_tiet: "",
    trang_thai: "1",
  });

  // Lay danh muc va thuong hieu cho the select
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dm = await getDanhMucs(1, 100);
        const th = await getThuongHieus(1, 100);
        setDanhMucs(dm.data || []);
        setThuongHieus(th.data || []);
      } catch (err) {
        console.error("Error fetching danh muc / thuong hieu:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Tu tao duong dan khi nhap ten san pham
    if (name === "ten_san_pham") {
      setForm({
        ...form,
        ten_san_pham: value,
        duong_dan: taoSlug(value),
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.ten_san_pham.trim()) {
      newErrors.ten_san_pham = "Tên sản phẩm không được để trống";
    }
    if (!form.danh_muc_id) {
      newErrors.danh_muc_id = "Vui lòng chọn danh mục";
    }
    if (form.gia === "" || Number(form.gia) < 0) {
      newErrors.gia = "Vui lòng nhập giá hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createSanPham({
        ten_san_pham: form.ten_san_pham.trim(),
        duong_dan: form.duong_dan,
        danh_muc_id: Number(form.danh_muc_id),
        thuong_hieu_id: form.thuong_hieu_id ? Number(form.thuong_hieu_id) : null,
        gia: Number(form.gia),
        gia_khuyen_mai: form.gia_khuyen_mai ? Number(form.gia_khuyen_mai) : null,
        so_luong_ton: Number(form.so_luong_ton) || 0,
        hinh_anh_dai_dien: form.hinh_anh_dai_dien || null,
        mo_ta_ngan: form.mo_ta_ngan || null,
        mo_ta_chi_tiet: form.mo_ta_chi_tiet || null,
        trang_thai: Number(form.trang_thai),
      });

      alert("Thêm sản phẩm thành công");
      router.push("/admin/sanpham");
    } catch (err) {
      console.error(err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        alert(err.message || "Thêm sản phẩm thất bại!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Thêm Sản Phẩm
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Row 1: Tên & Đường dẫn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              name="ten_san_pham"
              value={form.ten_san_pham}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ten_san_pham ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên sản phẩm"
            />
            <Loi loi={errors.ten_san_pham} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn
            </label>
            <input
              type="text"
              name="duong_dan"
              value={form.duong_dan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
              placeholder="duong-dan-san-pham"
              readOnly
            />
            <Loi loi={errors.duong_dan} />
          </div>
        </div>

        {/* Row 2: Danh mục & Thương hiệu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục *
            </label>
            <select
              name="danh_muc_id"
              value={form.danh_muc_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.danh_muc_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Chọn danh mục --</option>
              {danhMucs.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.ten_danh_muc}
                </option>
              ))}
            </select>
            <Loi loi={errors.danh_muc_id} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thương hiệu
            </label>
            <select
              name="thuong_hieu_id"
              value={form.thuong_hieu_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Không có thương hiệu --</option>
              {thuongHieus.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.ten_thuong_hieu}
                </option>
              ))}
            </select>
            <Loi loi={errors.thuong_hieu_id} />
          </div>
        </div>

        {/* Row 3: Giá, Giá khuyến mãi, Tồn kho */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá *
            </label>
            <input
              type="number"
              name="gia"
              min="0"
              value={form.gia}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.gia ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập giá"
            />
            <Loi loi={errors.gia} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá khuyến mãi
            </label>
            <input
              type="number"
              name="gia_khuyen_mai"
              min="0"
              value={form.gia_khuyen_mai}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Có thể để trống"
            />
            <Loi loi={errors.gia_khuyen_mai} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng tồn
            </label>
            <input
              type="number"
              name="so_luong_ton"
              min="0"
              value={form.so_luong_ton}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Loi loi={errors.so_luong_ton} />
          </div>
        </div>

        {/* Row 4: Hình ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hình ảnh đại diện (đường dẫn ảnh)
          </label>
          <input
            type="text"
            name="hinh_anh_dai_dien"
            value={form.hinh_anh_dai_dien}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="vd: banh-kem-dau-tay.jpg hoặc https://..."
          />
          {form.hinh_anh_dai_dien && (
            <img
              src={layAnh(form.hinh_anh_dai_dien)}
              alt="Xem trước ảnh"
              className="mt-3 h-28 w-28 object-cover rounded-md border border-gray-200"
            />
          )}
        </div>

        {/* Row 5: Trạng thái */}
        <div className="flex items-center space-x-8 bg-gray-50 p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="trang_thai"
                value="1"
                checked={form.trang_thai === "1"}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Hiển thị</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="trang_thai"
                value="0"
                checked={form.trang_thai === "0"}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Ẩn</span>
            </label>
          </div>
        </div>

        {/* Row 6: Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả ngắn
          </label>
          <textarea
            name="mo_ta_ngan"
            value={form.mo_ta_ngan}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mô tả ngắn..."
          ></textarea>
          <Loi loi={errors.mo_ta_ngan} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả chi tiết
          </label>
          <textarea
            name="mo_ta_chi_tiet"
            value={form.mo_ta_chi_tiet}
            onChange={handleChange}
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mô tả chi tiết sản phẩm..."
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 border-t pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow-sm transition disabled:opacity-60"
          >
            {submitting ? "Đang lưu..." : "Lưu Sản Phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}