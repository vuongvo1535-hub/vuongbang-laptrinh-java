import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
                <div>
                    <h2 className="text-xl font-bold text-white">📚 Thư Viện Sách</h2>
                    <p className="mt-2 text-sm text-gray-400">Tra cứu, đặt trước và mượn sách thuận tiện cho độc giả.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-white">Liên kết</h3>
                    <ul className="mt-2 space-y-1 text-sm">
                        <li><Link href="/sach" className="hover:text-white">Tra cứu sách</Link></li>
                        <li><Link href="/gioithieu" className="hover:text-white">Giới thiệu và quy định</Link></li>
                        <li><Link href="/lienhe" className="hover:text-white">Liên hệ với chúng tôi </Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-white">Giờ mở cửa</h3>
                    <p className="mt-2 text-sm text-gray-400">Thứ Hai – Thứ Sáu: 7:30 – 17:00<br />Thứ Bảy: 8:00 – 11:30</p>
                </div>
            </div>
            <p className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">© 2026 Thư Viện Sách. Bảo lưu mọi quyền.</p>
        </footer>
    );
}
