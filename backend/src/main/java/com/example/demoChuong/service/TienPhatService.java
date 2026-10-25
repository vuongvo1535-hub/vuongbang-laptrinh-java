package com.example.demoChuong.service;

import com.example.demoChuong.dto.TienPhatDTO;
import java.util.List;

public interface TienPhatService {
    List<TienPhatDTO> layTatCa(String trangThai);
    TienPhatDTO layTheoId(Long id);
    TienPhatDTO thanhToan(Long id, String phuongThuc);
}
