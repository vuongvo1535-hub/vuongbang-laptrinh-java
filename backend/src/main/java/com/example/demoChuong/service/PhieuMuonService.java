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
}
