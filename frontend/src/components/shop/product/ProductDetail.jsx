import Link from "next/link";

export default function ProductDetail({ sanPham }) {
  const gia = Number(sanPham.gia);
  const giaKhuyenMai = sanPham.gia_khuyen_mai
    ? Number(sanPham.gia_khuyen_mai)
    : null;

  const hinhAnh = process.env.NEXT_PUBLIC_IMAGE_URL + sanPham.hinh_anh_dai_dien;

  return (
    <div>

      {/* Breadcrumb */}
      <Link
        href="/products"
        className="text-sm text-gray-500 hover:text-orange-700"
      >
        ← Quay lại danh sách sản phẩm
      </Link>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Hình ảnh sản phẩm */}
        <div className="rounded-xl overflow-hidden bg-white shadow-sm">
          <img
            src={hinhAnh}
            alt={sanPham.ten_san_pham}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <span className="inline-block text-xs font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
            {sanPham.danh_muc.ten_danh_muc}
          </span>

          <h1 className="mt-3 text-3xl font-bold text-gray-800">
            {sanPham.ten_san_pham}
          </h1>

          {/* Giá */}
          <div className="flex items-center gap-3 mt-4">
            {giaKhuyenMai ? (
              <>
                <span className="text-2xl font-bold text-orange-700">
                  {giaKhuyenMai.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-gray-400 text-lg line-through">
                  {gia.toLocaleString("vi-VN")}₫
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-orange-700">
                {gia.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>

          {/* Mô tả */}
          <p className="mt-4 text-gray-600 leading-relaxed">
            {sanPham.mo_ta_chi_tiet}
          </p>

          {/* Nút thêm vào giỏ hàng (chưa nối API giỏ hàng) */}
          <button
            type="button"
            className="mt-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}