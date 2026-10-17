"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDanhMucs, createDanhMuc } from "@/services/admin/danhMucService";
import { taoSlug } from "@/utils/slug";

export default function CreateDanhMucPage() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [danhMucCha, setDanhMucCha] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    ten_danh_muc: "",
    duong_dan: "",
    danh_muc_cha_id: "",
    hinh_anh: "",
    mo_ta: "",
    thu_tu: 0,
    trang_thai: "1",
  });

  // Lay danh sach danh muc de chon danh muc cha
  useEffect(() => {
    const fetchDanhMucs = async () => {
      try {
        const res = await getDanhMucs(1, 100);
        setDanhMucCha(res.data || []);
      } catch (err) {
        console.error("Error fetching danh muc:", err);
      }
    };

    fetchDanhMucs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Tu tao duong dan khi nhap ten danh muc
    if (name === "ten_danh_muc") {
      setForm({
        ...form,
        ten_danh_muc: value,
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

    if (!form.ten_danh_muc.trim()) {
      newErrors.ten_danh_muc = "Tên danh mục không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createDanhMuc({
        ten_danh_muc: form.ten_danh_muc.trim(),
        duong_dan: form.duong_dan,
        danh_muc_cha_id: form.danh_muc_cha_id
          ? Number(form.danh_muc_cha_id)
          : null,
        hinh_anh: form.hinh_anh || null,
        mo_ta: form.mo_ta || null,
        thu_tu: Number(form.thu_tu) || 0,
        trang_thai: Number(form.trang_thai),
      });

      alert("Thêm danh mục thành công");
      router.push("/admin/danhmuc");
    } catch (err) {
      console.error(err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        alert(err.message || "Thêm danh mục thất bại!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Thêm Danh Mục
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Row 1: Tên danh mục & Danh mục cha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục *
            </label>
            <input
              type="text"
              name="ten_danh_muc"
              value={form.ten_danh_muc}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ten_danh_muc ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên danh mục"
            />
            {errors.ten_danh_muc && (
              <p className="text-red-500 text-xs mt-1">
                {Array.isArray(errors.ten_danh_muc)
                  ? errors.ten_danh_muc[0]
                  : errors.ten_danh_muc}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục cha
            </label>
            <select
              name="danh_muc_cha_id"
              value={form.danh_muc_cha_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">-- Không có (Danh mục gốc) --</option>
              {/* Chỉ danh mục gốc mới làm được danh mục cha */}
              {danhMucCha
                .filter((item) => !item.danh_muc_cha_id)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.ten_danh_muc}
                  </option>
                ))}
            </select>
            {errors.danh_muc_cha_id && (
              <p className="text-red-500 text-xs mt-1">
                {Array.isArray(errors.danh_muc_cha_id)
                  ? errors.danh_muc_cha_id[0]
                  : errors.danh_muc_cha_id}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Đường dẫn & Thứ tự */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              placeholder="duong-dan-danh-muc"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thứ tự sắp xếp
            </label>
            <input
              type="number"
              name="thu_tu"
              value={form.thu_tu}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 3: Trạng thái */}
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

        {/* Row 4: Hình ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hình ảnh danh mục (đường dẫn ảnh)
          </label>
          <input
            type="text"
            name="hinh_anh"
            value={form.hinh_anh}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="vd: categories/banh-sinh-nhat.jpg hoặc https://..."
          />
        </div>

        {/* Row 5: Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả danh mục
          </label>
          <textarea
            name="mo_ta"
            value={form.mo_ta}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mô tả chi tiết danh mục..."
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
            {submitting ? "Đang lưu..." : "Lưu Danh Mục"}
          </button>
        </div>
      </form>
    </div>
  );
}