"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBaiViets } from "@/services/shop/Baivietservices";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError("");

        const res = await getBaiViets(currentPage);

        setPosts(res.data || []);
        setLastPage(res.last_page || 1);
      } catch (err) {
        console.error("Lỗi tải bài viết:", err);

        setError(
          "Không thể tải danh sách bài viết."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [currentPage]);

  function changePage(page) {
    if (page < 1 || page > lastPage) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function getImageUrl(image) {
    if (!image) {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL ||
      "http://127.0.0.1:8000/storage/";

    return `${baseUrl}${image}`;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 pt-32 pb-12">

      {/* TIÊU ĐỀ */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-orange-700">
          Bài viết
        </h1>

        <p className="mt-3 text-gray-600">
          Những thông tin hữu ích từ Mây Cake
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-gray-500">
            Đang tải bài viết...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="text-center py-16">
          <p className="text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* KHÔNG CÓ DỮ LIỆU */}
      {!loading &&
        !error &&
        posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">
              Chưa có bài viết.
            </p>
          </div>
        )}

      {/* DANH SÁCH BÀI VIẾT */}
      {!loading &&
        !error &&
        posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

              {posts.map((post) => {
                const imageUrl = getImageUrl(
                  post.hinh_anh_dai_dien
                );

                return (
                  <article
                    key={post.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
                  >

                    {/* ẢNH */}
                    <Link
                      href={`/posts/${post.duong_dan}`}
                    >
                      <div className="relative w-full h-56 bg-orange-50 overflow-hidden">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={post.tieu_de}
                            className="w-full h-full object-cover hover:scale-105 transition duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";

                              e.currentTarget.parentElement
                                .querySelector(
                                  ".image-placeholder"
                                )
                                ?.classList.remove(
                                  "hidden"
                                );
                            }}
                          />
                        ) : null}

                        {/* ẢNH KHÔNG CÓ / LỖI */}
                        <div
                          className={`image-placeholder absolute inset-0 flex flex-col items-center justify-center text-gray-400 ${
                            imageUrl ? "hidden" : ""
                          }`}
                        >
                          <span className="text-5xl">
                            🖼️
                          </span>

                          <span className="mt-2">
                            Ảnh bài viết
                          </span>
                        </div>

                      </div>
                    </Link>

                    {/* NỘI DUNG */}
                    <div className="p-6">

                      <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
                        {post.tieu_de}
                      </h2>

                      <p className="mt-3 text-gray-600 leading-6 line-clamp-3">
                        {post.mo_ta_ngan}
                      </p>

                      <div className="flex items-center justify-between mt-5">

                        <span className="text-sm text-gray-400">
                          👁 {post.luot_xem || 0}
                        </span>

                        <Link
                          href={`/posts/${post.duong_dan}`}
                          className="text-orange-700 font-semibold hover:text-orange-900"
                        >
                          Xem chi tiết →
                        </Link>

                      </div>
                    </div>
                  </article>
                );
              })}

            </div>

            {/* PHÂN TRANG */}
            {lastPage > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">

                {/* TRANG TRƯỚC */}
                <button
                  onClick={() =>
                    changePage(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-50"
                >
                  ←
                </button>

                {/* SỐ TRANG */}
                {Array.from(
                  { length: lastPage },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      changePage(page)
                    }
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === page
                        ? "bg-orange-700 text-white border-orange-700"
                        : "border-gray-300 hover:bg-orange-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* TRANG SAU */}
                <button
                  onClick={() =>
                    changePage(currentPage + 1)
                  }
                  disabled={
                    currentPage === lastPage
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-50"
                >
                  →
                </button>

              </div>
            )}

            {/* THÔNG TIN TRANG */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Trang {currentPage} / {lastPage}
            </p>
          </>
        )}
    </main>
  );
}