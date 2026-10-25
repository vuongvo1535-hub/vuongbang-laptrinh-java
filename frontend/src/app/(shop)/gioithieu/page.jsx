const QUY_DINH = [
    "Mang theo thẻ thư viện còn hạn khi mượn và trả sách.",
    "Mỗi lần mượn tối đa 5 cuốn; thời hạn mượn do thư viện quy định trên phiếu mượn.",
    "Trả quá hạn, làm hư hỏng hoặc mất sách sẽ bị xử lý theo quy định về tiền phạt.",
    "Sách đang được mượn hết có thể đặt trước, thư viện giữ sách trong thời gian có hạn.",
];

export default function GioiThieuPage() {
    return (
        <div className="container mx-auto px-4 py-10 max-w-3xl">
            <h1 className="text-3xl font-bold">Giới thiệu thư viện</h1>
            <p className="mt-3 text-gray-700">Thư viện phục vụ độc giả tra cứu tài liệu, đặt trước và mượn trả sách. Hệ thống giúp biết nhanh sách còn bao nhiêu bản và nằm ở kệ nào.</p>
            <h2 className="mt-8 text-xl font-bold">Quy định mượn trả</h2>
            <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700">
                {QUY_DINH.map((q) => <li key={q}>{q}</li>)}
            </ul>
        </div>
    );
}
