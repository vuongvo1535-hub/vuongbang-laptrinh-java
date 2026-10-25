"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBaiVietByDuongDan } from "@/services/shop/Baivietservices";

export default function BaiVietDetail({ params }) {
  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        setError("");

        const { duongDan } = await params;

        const res =
          await getBaiVietByDuongDan(
            duongDan
          );

        setPost(res);
      } catch (err) {
        console.error(
          "Lỗi tải bài viết:",
          err
        );

        setError(
          "Không tìm thấy bài viết."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [params]);

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

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-12">
        <p className="text-center text-gray-500">
          Đang tải bài viết...
        </p>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-12">

        <div className="text-center">
          <p className="text-red-500 mb-5">
            {error ||
              "Không tìm thấy bài viết."}
          </p>

          <Link
            href="/posts"
            className="text-orange-700 font-semibold hover:text-orange-900"
          >
            ← Quay lại bài viết
          </Link>
        </div>

      </main>
    );
  }

  const imageUrl = getImageUrl(
    post.hinh_anh_dai_dien
  );

  return (
    <main className="max-w-4xl mx-auto px-6 pt-32 pb-12">

      {/* QUAY LẠI */}
      <Link
        href="/posts"
        className="inline-block text-orange-700 font-medium hover:text-orange-900"
      >
        ← Quay lại bài viết
      </Link>

      {/* ẢNH ĐẠI DIỆN */}
      <div className="mt-6 w-full h-96 bg-orange-50 rounded-2xl overflow-hidden">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.tieu_de}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display =
                "none";

              e.currentTarget.parentElement
                .querySelector(
                  ".detail-image-placeholder"
                )
                ?.classList.remove(
                  "hidden"
                );
            }}
          />
        ) : null}

        {/* FALLBACK */}
        <div
          className={`detail-image-placeholder w-full h-full flex flex-col items-center justify-center text-gray-400 ${
            imageUrl ? "hidden" : ""
          }`}
        >
          <span className="text-6xl">
            🖼️
          </span>

          <p className="mt-3 text-lg">
            Ảnh bài viết
          </p>
        </div>

      </div>

      {/* TIÊU ĐỀ */}
      <article className="mt-8">

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          {post.tieu_de}
        </h1>

        {/* THÔNG TIN */}
        <div className="flex items-center gap-5 mt-5 text-sm text-gray-500">

          <span>
            👁 {post.luot_xem || 0} lượt xem
          </span>

          {post.ngay_dang && (
            <span>
              📅{" "}
              {new Date(
                post.ngay_dang
              ).toLocaleDateString(
                "vi-VN"
              )}
            </span>
          )}

        </div>

        {/* MÔ TẢ NGẮN */}
        <p className="mt-7 text-xl text-gray-600 leading-8">
          {post.mo_ta_ngan}
        </p>

        {/* NỘI DUNG */}
        <div className="mt-8 pt-8 border-t border-gray-200">

          {post.noi_dung
            ?.split("\n")
            .filter(
              (paragraph) =>
                paragraph.trim() !== ""
            )
            .map(
              (paragraph, index) => (
                <p
                  key={index}
                  className="mb-6 text-gray-700 text-lg leading-9"
                >
                  {paragraph}
                </p>
              )
            )}

        </div>

      </article>

      {/* CUỐI TRANG */}
      <div className="mt-10 pt-6 border-t border-gray-200">

        <Link
          href="/posts"
          className="inline-block text-orange-700 font-semibold hover:text-orange-900"
        >
          ← Xem tất cả bài viết
        </Link>

      </div>

    </main>
  );
}