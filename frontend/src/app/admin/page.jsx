"use client";

import Link from "next/link";
import {
    FiBox,
    FiTag,
    FiShoppingCart,
    FiUsers,
} from "react-icons/fi";

const thongKe = [
    {
        name: "San pham",
        value: "120",
        link: "/admin/sanpham",
        icon: FiBox,
    },
    {
        name: "Danh muc",
        value: "12",
        link: "/admin/danhmuc",
        icon: FiTag,
    },
    {
        name: "Don hang",
        value: "35",
        link: "/admin/donhang",
        icon: FiShoppingCart,
    },
    {
        name: "Nguoi dung",
        value: "86",
        link: "/admin/nguoidung",
        icon: FiUsers,
    },
];

export default function AdminPage() {
    return (
        <div>

            {/* Tieu de */}
            <div className="mb-7">
                <h1 className="text-2xl font-bold text-gray-800">
                    Xin chao, Quan tri vien 👋
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Chao mung ban den voi trang quan tri he thong.
                </p>
            </div>

            {/* Thong ke */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {thongKe.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.link}
                            href={item.link}
                            className="group rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {item.name}
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-gray-800">
                                        {item.value}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-900">
                                    <Icon size={24} />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-orange-700">
                                Xem chi tiet →
                            </p>
                        </Link>
                    );
                })}
            </div>

            {/* Noi dung */}
            <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Hoat dong */}
                <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-gray-800">
                            Hoat dong gan day
                        </h2>

                        <p className="text-sm text-gray-500">
                            Tong quan cac hoat dong trong he thong
                        </p>
                    </div>

                    <div className="space-y-4">

                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="font-medium text-gray-700">
                                    Them san pham moi
                                </p>
                                <p className="text-xs text-gray-400">
                                    San pham vua duoc them vao he thong
                                </p>
                            </div>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                                Moi
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="font-medium text-gray-700">
                                    Don hang moi
                                </p>
                                <p className="text-xs text-gray-400">
                                    Co don hang dang cho xu ly
                                </p>
                            </div>

                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700">
                                Cho xu ly
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">
                                    Nguoi dung moi
                                </p>
                                <p className="text-xs text-gray-400">
                                    Co nguoi dung moi dang ky
                                </p>
                            </div>

                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                                Dang ky
                            </span>
                        </div>

                    </div>
                </div>

                {/* Truy cap nhanh */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800">
                        Truy cap nhanh
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Quan ly nhanh
                    </p>

                    <div className="mt-5 space-y-3">

                        <Link
                            href="/admin/sanpham"
                            className="block rounded-lg bg-gray-50 p-4 transition hover:bg-orange-50"
                        >
                            <p className="font-medium text-gray-700">
                                Quan ly san pham
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Them, sua, xoa san pham
                            </p>
                        </Link>

                        <Link
                            href="/admin/danhmuc"
                            className="block rounded-lg bg-gray-50 p-4 transition hover:bg-orange-50"
                        >
                            <p className="font-medium text-gray-700">
                                Quan ly danh muc
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Quan ly danh muc san pham
                            </p>
                        </Link>

                        <Link
                            href="/admin/donhang"
                            className="block rounded-lg bg-gray-50 p-4 transition hover:bg-orange-50"
                        >
                            <p className="font-medium text-gray-700">
                                Quan ly don hang
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Kiem tra don hang
                            </p>
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    );
}