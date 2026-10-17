import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-nau-dam text-vang-kem mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Giới thiệu */}
        <div>
          <h3 className="text-2xl font-black text-cam-vang mb-3">Thư viện</h3>
          <p className="text-sm leading-relaxed text-vang-kem/80 max-w-md">
            Tra cứu sách theo tên và danh mục, xem thông tin chi tiết cùng
            tình trạng sách trên kệ.
          </p>
        </div>

        {/* Liên kết */}
        <div>
          <h4 className="font-bold text-cam-vang mb-3">Liên kết nhanh</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-vang-kem/80 hover:text-cam-vang transition">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-vang-kem/80 hover:text-cam-vang transition">
                Sách
              </Link>
            </li>
            <li>
              <Link href="/categories" className="text-vang-kem/80 hover:text-cam-vang transition">
                Danh mục
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-vang-kem/15 text-center py-4">
        <p className="text-sm text-vang-kem/60">© 2026 Thư viện. All rights reserved.</p>
      </div>
    </footer>
  );
}
