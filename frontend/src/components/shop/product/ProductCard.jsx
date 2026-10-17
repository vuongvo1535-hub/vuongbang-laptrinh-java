import Link from "next/link";

export default function ProductCard({ product }) {
  const gia = Number(product.gia);
  const giaKhuyenMai = product.gia_khuyen_mai
    ? Number(product.gia_khuyen_mai)
    : null;

  const hasDiscount = giaKhuyenMai && giaKhuyenMai < gia;
  const percentOff = hasDiscount
    ? Math.round(((gia - giaKhuyenMai) / gia) * 100)
    : 0;

  const hinhAnh = product.hinh_anh_dai_dien
    ? process.env.NEXT_PUBLIC_IMAGE_URL + product.hinh_anh_dai_dien
    : "";

  return (
    <Link
      href={`/products/${product.duong_dan}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 relative"
    >
      {/* Giảm giá */}
      {hasDiscount && (
        <span className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{percentOff}%
        </span>
      )}

      {/* Hình ảnh */}
      <div className="overflow-hidden rounded-lg mb-3">
        <img
          src={hinhAnh}
          alt={product.ten_san_pham || "Sản phẩm Mây Cake"}
          className="w-full h-40 object-cover hover:scale-105 transition"
        />
      </div>

      {/* Tên sản phẩm */}
      <h3 className="font-semibold text-gray-800 line-clamp-1">
        {product.ten_san_pham}
      </h3>

      {/* Giá */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-orange-700 font-bold">
          {(hasDiscount ? giaKhuyenMai : gia).toLocaleString("vi-VN")}₫
        </span>

        {hasDiscount && (
          <span className="text-gray-400 text-sm line-through">
            {gia.toLocaleString("vi-VN")}₫
          </span>
        )}
      </div>
    </Link>
  );
}