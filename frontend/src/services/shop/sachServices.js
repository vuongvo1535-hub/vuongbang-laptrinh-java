import axiosClient from "@/lib/axiosClient";

// Lay danh sach sach (Spring tra ve mang thuan). tuKhoa: tim theo ten sach
export async function getSachs(tuKhoa = "") {
  const res = await axiosClient.get("/sach", {
    params: tuKhoa ? { tuKhoa } : {},
  });
  return res.data;
}

// Lay mot sach theo id
export async function getSachTheoId(id) {
  const res = await axiosClient.get(`/sach/${id}`);
  return res.data;
}

// Tac gia, NXB, ten danh muc va so ban sao con tren ke
export async function getChiTietSach(id) {
  const res = await axiosClient.get(`/sach/${id}/chiTiet`);
  return res.data;
}
