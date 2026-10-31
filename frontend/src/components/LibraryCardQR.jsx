import { QRCodeCanvas } from "qrcode.react";

/**
 * Component hiển thị mã QR cho thẻ thư viện.
 * @param {{ readerId: string }} props
 */
export default function LibraryCardQR({ readerId }) {
  // Bạn có thể thay đổi giá trị mã QR tùy ý; ở đây dùng URL chứa ID độc nhất.
  const value = `https://demochuong.com/api/docGia/${readerId}`;
  return (
    <div className="p-4 bg-white rounded shadow flex flex-col items-center">
      <QRCodeCanvas value={value} size={200} />
      <p className="mt-2 text-sm text-gray-600">{readerId}</p>
    </div>
  );
}
