import axiosClient from "@/lib/axiosClient";

// Lay danh sach danh muc sach (mang thuan)
export async function getDanhMucSachs() {
  const res = await axiosClient.get("/danhMuc");
  return res.data;
}
