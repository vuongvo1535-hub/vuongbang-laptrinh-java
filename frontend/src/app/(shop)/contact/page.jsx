"use client";

import { useState } from "react";
import { sendContact } from "@/services/shop/Lienheservices";

export default function ContactPage() {
  const [form, setForm] = useState({
    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    tieu_de: "",
    noi_dung: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendContact(form);

      setMessage("Gửi liên hệ thành công! Cảm ơn bạn đã liên hệ với Mây Cake.");

      setForm({
        ho_ten: "",
        email: "",
        so_dien_thoai: "",
        tieu_de: "",
        noi_dung: "",
      });
    } catch (err) {
      console.error(err);
      setError("Không thể gửi liên hệ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-orange-700">
          Liên hệ với Mây Cake
        </h1>

        <p className="mt-3 text-gray-600">
          Nếu bạn cần hỗ trợ hoặc có góp ý, hãy gửi thông tin cho chúng tôi.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
        {message && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Họ và tên *
            </label>

            <input
              type="text"
              name="ho_ten"
              value={form.ho_ten}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Số điện thoại
              </label>

              <input
                type="text"
                name="so_dien_thoai"
                value={form.so_dien_thoai}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Tiêu đề
            </label>

            <input
              type="text"
              name="tieu_de"
              value={form.tieu_de}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              placeholder="Bạn muốn hỗ trợ vấn đề gì?"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Nội dung *
            </label>

            <textarea
              name="noi_dung"
              value={form.noi_dung}
              onChange={handleChange}
              required
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 resize-none"
              placeholder="Nhập nội dung cần hỗ trợ..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-700 py-3 font-semibold text-white hover:bg-orange-800 disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi liên hệ"}
          </button>
        </form>
      </div>
    </main>
  );
}