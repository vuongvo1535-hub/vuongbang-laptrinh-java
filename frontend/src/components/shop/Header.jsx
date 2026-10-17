"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiBookOpen } from "react-icons/fi";
import Menu from "@/components/shop/Menu";
import { shopMenu } from "@/data/menu";

export default function Header() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-vang-kem shadow-sm">
      {/* Hàng 1: Logo + Tìm kiếm */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6 h-14">
          <Link
            href="/"
            className="shrink-0 flex items-center gap-2 text-xl sm:text-2xl font-black text-nau-dam hover:text-cam-dam transition"
          >
            <FiBookOpen className="text-cam-dam" size={24} />
            <span>Thư viện</span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex flex-1 max-w-xl ml-auto items-center bg-trang-kem border border-cam-vang/50 rounded-lg p-1 focus-within:border-cam-dam transition"
          >
            <FiSearch className="mx-2 text-nau-dam/50 shrink-0" size={16} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm sách theo tên..."
              className="flex-1 min-w-0 bg-transparent outline-none text-sm text-nau-dam placeholder:text-nau-dam/40"
            />
            <button
              type="submit"
              className="shrink-0 bg-cam-vang hover:bg-cam-dam text-nau-dam text-sm font-semibold px-3 py-1 rounded-md transition"
            >
              Tìm
            </button>
          </form>
        </div>
      </div>

      {/* Hàng 2: Menu điều hướng */}
      <div className="border-t border-cam-vang/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-center text-sm font-medium">
          <Menu items={shopMenu} />
        </div>
      </div>
    </header>
  );
}
