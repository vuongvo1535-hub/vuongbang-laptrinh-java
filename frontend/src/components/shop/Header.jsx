"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { shopMenu } from "@/data/menu";

export default function Header() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const [moMenu, setMoMenu] = useState(false);

    const timKiem = (e) => {
        e.preventDefault();
        router.push(q.trim() ? `/sach?q=${encodeURIComponent(q.trim())}` : "/sach");
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <Link href="/" className="text-2xl font-black text-emerald-700 tracking-wide whitespace-nowrap">
                    📚 Thư Viện Sách
                </Link>

                <nav className="hidden md:flex gap-6">
                    {shopMenu.map((m) => (
                        <Link key={m.link} href={m.link} className="font-semibold text-gray-700 hover:text-emerald-700 transition-colors">
                            {m.name}
                        </Link>
                    ))}
                </nav>

                <form onSubmit={timKiem} className="hidden md:flex flex-1 max-w-xs">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Tìm tên sách, tác giả..."
                        className="w-full border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button className="bg-emerald-600 text-white px-3 rounded-r-lg hover:bg-emerald-700">🔍</button>
                </form>

                <button onClick={() => setMoMenu(!moMenu)} className="md:hidden text-2xl" aria-label="Mở menu">☰</button>
            </div>

            {moMenu && (
                <nav className="md:hidden border-t border-gray-200 px-4 py-3 flex flex-col gap-3 bg-white">
                    {shopMenu.map((m) => (
                        <Link key={m.link} href={m.link} onClick={() => setMoMenu(false)} className="font-semibold text-gray-700">
                            {m.name}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
}
