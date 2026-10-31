package com.example.demoChuong.controller;

import com.example.demoChuong.dto.SachChiTietDTO;
import com.example.demoChuong.entity.DanhMuc;
import com.example.demoChuong.entity.Sach;
import com.example.demoChuong.repository.DanhMucRepository;
import com.example.demoChuong.repository.SachRepository;
import com.example.demoChuong.service.SachChiTietService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/troLyAi")
public class TroLyAiController {

    private final SachRepository sachRepository;
    private final DanhMucRepository danhMucRepository;
    private final SachChiTietService chiTietService;

    public TroLyAiController(SachRepository sachRepository,
                             DanhMucRepository danhMucRepository,
                             SachChiTietService chiTietService) {
        this.sachRepository = sachRepository;
        this.danhMucRepository = danhMucRepository;
        this.chiTietService = chiTietService;
    }

    /** Xử lý hội thoại chat với Trợ lý ảo AI Thư viện */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> request) {
        String msg = request.getOrDefault("message", "").trim().toLowerCase();
        Map<String, Object> resp = new HashMap<>();

        if (msg.isBlank()) {
            resp.put("reply", "Xin chào bạn! Tôi là Thư ký ảo AI của Thư viện số. Tôi có thể hỗ trợ bạn tra cứu sách, hướng dẫn quy định mượn trả, gia hạn trực tuyến hoặc giải đáp về thẻ thư viện.");
            resp.put("suggestedQuestions", List.of("Quy định mượn trả sách", "Cách gia hạn mượn 1-click", "Phí phạt quá hạn là bao nhiêu?", "Gợi ý sách hay nhất tuần"));
            resp.put("books", Collections.emptyList());
            return ResponseEntity.ok(resp);
        }

        // 1. Ý định: Quy định mượn trả
        if (msg.contains("quy định") || msg.contains("quy che") || (msg.contains("mượn") && (msg.contains("bao lâu") || msg.contains("mấy cuốn") || msg.contains("bao nhiêu ngày")))) {
            resp.put("reply", "📚 **Quy định mượn trả sách tại Thư viện:**\n\n" +
                    "• **Số lượng mượn:** Mỗi bạn đọc được mượn tối đa **5 cuốn sách** cùng lúc.\n" +
                    "• **Thời hạn mượn:** **14 ngày** tính từ ngày bạn nhận sách tại quầy.\n" +
                    "• **Gia hạn:** Được tự động gia hạn thêm **+7 ngày** trực tuyến 1 lần trước khi quá hạn.\n" +
                    "• **Đặt trước:** Nếu sách đang hết bản sao trên kệ, bạn có thể bấm nút **📌 Đặt trước sách** để xếp hàng chờ.");
            resp.put("suggestedQuestions", List.of("Cách gia hạn sách?", "Phí phạt khi quá hạn?", "Thẻ thư viện QR là gì?"));
            resp.put("books", Collections.emptyList());
            return ResponseEntity.ok(resp);
        }

        // 2. Ý định: Gia hạn sách
        if (msg.contains("gia hạn") || msg.contains("them ngay") || msg.contains("cong ngay")) {
            resp.put("reply", "🔄 **Cách tự động gia hạn mượn sách 1-Click:**\n\n" +
                    "1. Bạn vào mục **Phiếu mượn & Phạt** trên thanh điều hướng.\n" +
                    "2. Tìm cuốn sách đang mượn muốn đọc thêm.\n" +
                    "3. Nhấn vào nút **🔄 Gia hạn +7 ngày**.\n" +
                    "• Hệ thống sẽ tự động dời ngày hẹn trả thêm 7 ngày mà bạn không cần phải mang sách đến thư viện!");
            resp.put("suggestedQuestions", List.of("Quy định mượn trả sách", "Phí phạt quá hạn là bao nhiêu?"));
            resp.put("books", Collections.emptyList());
            return ResponseEntity.ok(resp);
        }

        // 3. Ý định: Tiền phạt & Nộp phạt
        if (msg.contains("phạt") || msg.contains("quá hạn") || msg.contains("tre han") || msg.contains("nop phat")) {
            resp.put("reply", "💰 **Quy định Phí phạt quá hạn & Nộp phạt Online:**\n\n" +
                    "• **Mức phạt:** **5.000 VNĐ / ngày** cho mỗi cuốn sách quá hạn trả.\n" +
                    "• **Cách nộp phạt cực tiện lợi:**\n" +
                    "  - **Cách 1 (Online):** Vào trang **Phiếu mượn** ➔ Bấm **Nộp phạt** ➔ Quét mã QR MoMo / ZaloPay để thanh toán tức thì.\n" +
                    "  - **Cách 2 (Trực tiếp):** Nộp tiền mặt trực tiếp cho thủ thư tại quầy phục vụ.");
            resp.put("suggestedQuestions", List.of("Cách gia hạn sách?", "Quy định mượn trả sách", "Hướng dẫn nộp phạt qua MoMo"));
            resp.put("books", Collections.emptyList());
            return ResponseEntity.ok(resp);
        }

        // 4. Ý định: Thẻ thư viện điện tử QR
        if (msg.contains("thẻ") || msg.contains("the thu vien") || msg.contains("ma qr") || msg.contains("cap the")) {
            resp.put("reply", "🎫 **Thẻ Thư Viện Điện Tử Mã QR:**\n\n" +
                    "• Mỗi độc giả đều được cấp một **Mã thẻ độc quyền** tích hợp mã QR nhận diện.\n" +
                    "• Bạn chỉ cần vào mục **Thẻ thư viện QR** trên menu, đưa mã QR trên màn hình điện thoại cho thủ thư quét camera là có thể mượn trả sách ngay lập tức trong 1 giây mà không cần thẻ nhựa.");
            resp.put("suggestedQuestions", List.of("Xem thẻ thư viện của tôi", "Quy định mượn trả sách", "Gợi ý sách hay"));
            resp.put("books", Collections.emptyList());
            return ResponseEntity.ok(resp);
        }

        // 5. Ý định: Đọc thử sách online
        if (msg.contains("đọc thử") || msg.contains("xem truoc") || msg.contains("e-reader") || msg.contains("dark mode")) {
            resp.put("reply", "📖 **Tính năng Đọc Thử Sách E-Reader Trực Tuyến:**\n\n" +
                    "• Tại bất kỳ trang chi tiết sách nào, bạn chỉ cần bấm nút **📖 Đọc thử**.\n" +
                    "• Bạn có thể xem trước Mục lục, Lời mở đầu, và trích đoạn 15 trang đầu tiên.\n" +
                    "• Hỗ trợ 3 chế độ đọc bảo vệ mắt: **Ban ngày**, **Giấy ngà Sepia cổ điển**, và **Ban đêm (Dark Mode)** tùy chỉnh cỡ chữ!");
            resp.put("suggestedQuestions", List.of("Gợi ý sách hay nhất tuần", "Quy định mượn trả sách"));
            resp.put("books", Collections.emptyList());
            return ResponseEntity.ok(resp);
        }

        // 6. Ý định: Giờ mở cửa & Địa chỉ
        if (msg.contains("giờ") || msg.contains("mở cửa") || msg.contains("dia chi") || msg.contains("lien he") || msg.contains("hotline")) {
            resp.put("reply", "🏢 **Thời gian phục vụ & Địa chỉ Thư viện:**\n\n" +
                    "• **Thứ Hai – Thứ Sáu:** Sáng 07:30 – 11:30 | Chiều 13:00 – 17:00\n" +
                    "• **Thứ Bảy:** Sáng 08:00 – 11:30\n" +
                    "• **Chủ Nhật & Ngày lễ:** Nghỉ phục vụ tại quầy.\n" +
                    "• **Hệ thống trực tuyến (Tra cứu, Đặt trước, Gia hạn, Đọc thử):** Hoạt động 24/7!\n" +
                    "• **Địa chỉ:** Tòa nhà Thư viện Trung tâm - Khuôn viên Đại học.");
            resp.put("suggestedQuestions", List.of("Quy định mượn trả sách", "Cách gia hạn sách?"));
            resp.put("books", Collections.emptyList());
            return ResponseEntity.ok(resp);
        }

        // 7. Ý định: Tìm kiếm hoặc Gợi ý sách theo từ khóa / thể loại
        String tuKhoaTim = msg.replaceAll("(?i)(tìm sách|gợi ý sách|sách về|tôi muốn đọc|cuốn sách|tác giả|thể loại|sách)", "").trim();
        if (tuKhoaTim.isBlank()) tuKhoaTim = msg;

        List<Sach> ketQuaSach = sachRepository.findByTenSachContainingIgnoreCase(tuKhoaTim);
        if (ketQuaSach.isEmpty()) {
            ketQuaSach = sachRepository.findAll().stream().limit(4).toList();
            resp.put("reply", "Tôi chưa tìm thấy cuốn sách nào khớp chính xác với từ khóa \"" + msg + "\". Dưới đây là các đầu sách nổi bật đang sẵn sàng phục vụ tại thư viện để bạn tham khảo:");
        } else {
            if (ketQuaSach.size() > 4) {
                ketQuaSach = ketQuaSach.subList(0, 4);
            }
            resp.put("reply", "🎉 Tuyệt vời! Tôi đã tìm thấy " + ketQuaSach.size() + " đầu sách phù hợp nhất với yêu cầu của bạn:");
        }

        List<Map<String, Object>> bookCards = new ArrayList<>();
        for (Sach s : ketQuaSach) {
            Map<String, Object> bm = new HashMap<>();
            bm.put("id", s.getId());
            bm.put("tenSach", s.getTenSach());
            bm.put("anhBia", s.getAnhBia());
            bm.put("maSach", s.getMaSach());
            bm.put("namXuatBan", s.getNamXuatBan());
            try {
                SachChiTietDTO ct = chiTietService.layChiTiet(s.getId());
                if (ct != null) {
                    bm.put("tacGia", ct.tacGia() != null && !ct.tacGia().isEmpty() ? ct.tacGia().get(0).tenTacGia() : "Thư viện");
                    bm.put("danhMuc", ct.tenDanhMuc() != null ? ct.tenDanhMuc() : "Chung");
                    bm.put("conSach", ct.soBanSanSang() > 0);
                    bm.put("soBanSanSang", ct.soBanSanSang());
                }
            } catch (Exception ignored) {}
            bookCards.add(bm);
        }

        resp.put("books", bookCards);
        resp.put("suggestedQuestions", List.of("Quy định mượn trả sách", "Cách gia hạn sách?", "Thẻ thư viện QR"));
        return ResponseEntity.ok(resp);
    }
}
