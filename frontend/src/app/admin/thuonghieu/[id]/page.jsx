"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getThuongHieu, updateThuongHieu } from "@/services/admin/thuongHieuService";
import { taoSlug } from "@/utils/slug";

export default function EditThuongHieuPage() {
  const { id } = useParams();
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    ten_thuong_hieu: "",
    duong_dan: "",
    logo: "",
    mo_ta: "",
    trang_thai: "1",
  });

  // Lay thuong hieu can sua
  useEffect(() => {
    const fetchThuongHieu = async () => {
      try {
        const res = await getThuongHieu(id);
        const th = res.data ?? res;
        setForm({
          ten_thuong_hieu: th.ten_thuong_hieu ?? "",
          duong_dan: th.duong_dan ?? "",
          logo: th.logo ?? "",
          mo_ta: th.mo_ta ?? "",
          trang_thai: String(th.trang_thai ? 1 : 0),
        });
      } catch (err) {
        console.error(err);
        alert(err.message || "Không tìm thấy thương hiệu");
      } finally {
        setLoading(false);
      }
    };
    fetchThuongHieu();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Tu tao duong dan khi nhap ten thuong hieu
    if (name === "ten_thuong_hieu") {
      setForm({
        ...form,
        ten_thuong_hieu: value,
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

    if (!form.ten_thuong_hieu.trim()) {
      newErrors.ten_thuong_hieu = "Tên thương hiệu không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await updateThuongHieu(id, {
        ten_thuong_hieu: form.ten_thuong_hieu.trim(),
        duong_dan: form.duong_dan,
        logo: form.logo || null,
        mo_ta: form.mo_ta || null,
        trang_thai: Number(form.trang_thai),
      });

      alert("Cập nhật thương hiệu thành công");
      router.push("/admin/thuonghieu");
    } catch (err) {
      console.error(err);
      if (err.errors) {
        setErrors(err.errors);
      } else {
        alert(err.message || "Cập nhật thương hiệu thất bại!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-3 text-gray-500 text-sm font-medium">
          Đang tải dữ liệu thương hiệu...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Chỉnh Sửa Thương Hiệu
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Row 1: Tên & Đường dẫn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên thương hiệu *
            </label>
            <input
              type="text"
              name="ten_thuong_hieu"
              value={form.ten_thuong_hieu}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ten_thuong_hieu ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên thương hiệu"
            />
            {errors.ten_thuong_hieu && (
              <p className="text-red-500 text-xs mt-1">
                {Array.isArray(errors.ten_thuong_hieu)
                  ? errors.ten_thuong_hieu[0]
                  : errors.ten_thuong_hieu}
              </p>
            )}
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
              placeholder="duong-dan-thuong-hieu"
              readOnly
            />
            {errors.duong_dan && (
              <p className="text-red-500 text-xs mt-1">
                {Array.isArray(errors.duong_dan)
                  ? errors.duong_dan[0]
                  : errors.duong_dan}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo (đường dẫn ảnh)
          </label>
          <input
            type="text"
            name="logo"
            value={form.logo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="vd: brands/logo.png hoặc https://..."
          />
          {errors.logo && (
            <p className="text-red-500 text-xs mt-1">
              {Array.isArray(errors.logo) ? errors.logo[0] : errors.logo}
            </p>
          )}
        </div>

        {/* Row 3: Trạng thái */}
        <div className="flex items-center space-x-8 bg-gray-50 p-4 rounded-md">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Trạng thái:
            </span>
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

        {/* Row 4: Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả thương hiệu
          </label>
          <textarea
            name="mo_ta"
            value={form.mo_ta}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mô tả thương hiệu..."
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
            {submitting ? "Đang lưu..." : "Cập Nhật Thương Hiệu"}
          </button>
        </div>
      </form>
    </div>
  );
}