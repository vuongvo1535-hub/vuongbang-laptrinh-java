package com.example.demoChuong.service;

import com.example.demoChuong.dto.ChiTietPhieuMuonDTO;
import com.example.demoChuong.dto.PhieuMuonDTO;
import com.example.demoChuong.dto.TaoPhieuMuonRequest;
import com.example.demoChuong.dto.TraSachRequest;
import java.util.List;

public interface PhieuMuonService {
    List<PhieuMuonDTO> layTatCa();
    PhieuMuonDTO layTheoId(Long id);
    PhieuMuonDTO them(PhieuMuonDTO dto);
    PhieuMuonDTO sua(Long id, PhieuMuonDTO dto);
    void xoa(Long id);
    List<PhieuMuonDTO> layTheoDocGia(Long docGiaId);

    // Cac nghiep vu muon tra nang cao
    PhieuMuonDTO muonSach(TaoPhieuMuonRequest req);
    ChiTietPhieuMuonDTO traSach(TraSachRequest req);
    List<ChiTietPhieuMuonDTO> layChiTiet(Long phieuMuonId);

    // Gia hạn phiếu mượn (thêm 7 ngày vào ngày hẹn trả của tất cả sách chưa trả)
    PhieuMuonDTO giaHan(Long phieuMuonId);

    // Gửi email nhắc nhở trả sách cho phiếu mượn
    java.util.Map<String, Object> guiEmailNhacNho(Long phieuMuonId);

    // Tự động quét toàn bộ và gửi email nhắc nhở các phiếu sắp đến hạn hoặc quá hạn
    java.util.Map<String, Object> quetVaGuiEmailNhacNhoTatCa();
}
