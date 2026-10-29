package com.example.demoChuong.service;

import com.example.demoChuong.dto.TienPhatDTO;
import java.math.BigDecimal;
import java.util.List;

public interface TienPhatService {
    List<TienPhatDTO> layTatCa(String trangThai);
    List<TienPhatDTO> layTatCa(Long docGiaId, String trangThai);
    TienPhatDTO layTheoId(Long id);
    TienPhatDTO thanhToan(Long id, String phuongThuc);
    TienPhatDTO capNhatSoTien(Long id, BigDecimal soTien, String ghiChu);
}
