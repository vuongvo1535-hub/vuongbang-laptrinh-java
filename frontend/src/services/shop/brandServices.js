import axiosClient from "@/lib/axiosClient";

// Lấy danh sách thương hiệu (dùng để hiển thị bộ lọc bên shop)
export async function getBrands() {
  const res = await axiosClient.get("/thuonghieu");
  return res.data;
}