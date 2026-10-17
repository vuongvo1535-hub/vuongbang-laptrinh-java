import { notFound } from "next/navigation";
import BookDetail from "@/components/shop/book/BookDetail";
import { getSachTheoId, getChiTietSach } from "@/services/shop/sachServices";

export default async function Page({ params }) {
  const { id } = await params;

  // Thông tin sách là bắt buộc: 404 -> trang không tìm thấy, lỗi khác -> báo lỗi
  let sach;
  try {
    sach = await getSachTheoId(id);
  } catch (error) {
    if (error?.response?.status === 404) notFound();
    throw error;
  }

  // Tác giả, NXB, số bản còn là phần bổ sung: lỗi thì vẫn hiện thông tin sách
  let chiTiet = null;
  try {
    chiTiet = await getChiTietSach(id);
  } catch (error) {
    console.error("Không tải được chi tiết sách:", error?.message);
  }

  return <BookDetail sach={sach} chiTiet={chiTiet} />;
}
