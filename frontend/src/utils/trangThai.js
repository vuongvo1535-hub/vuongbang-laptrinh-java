// Doi gia tri ENUM trong CSDL sang chu tieng Viet va mau hien thi

const MAC_DINH = "bg-stone-200 text-stone-700";

const TRANG_THAI_SACH = {
  DANG_LUU_HANH: { label: "Đang lưu hành", mau: "bg-green-100 text-green-800" },
  NGUNG_LUU_HANH: { label: "Ngừng lưu hành", mau: MAC_DINH },
};

export function trangThaiSach(ma) {
  return TRANG_THAI_SACH[ma] || { label: ma || "", mau: MAC_DINH };
}
