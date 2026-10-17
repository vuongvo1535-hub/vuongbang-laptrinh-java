import axiosClient from "@/lib/axiosClient";

// Lấy danh sách sản phẩm
export async function getsanpham() {
  const res = await axiosClient.get("/sanpham");
  return res.data;
}

// Lấy sản phẩm theo đường dẫn (slug)
export async function getsanphamtheoduongdan(duong_dan) {
  const res = await axiosClient.get(`/sanpham/duong-dan/${duong_dan}`);
  return res.data;
}

// Lấy sản phẩm theo id
export async function getsanphamtheoid(id) {
  const res = await axiosClient.get(`/sanpham/${id}`);
  return res.data;
}