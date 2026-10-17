import axiosClient from "@/lib/axiosClient";

// Lấy danh sách danh mục (dùng để hiển thị menu/bộ lọc bên shop)
export async function getCategories() {
  const res = await axiosClient.get("/danhmuc");
  return res.data;
}