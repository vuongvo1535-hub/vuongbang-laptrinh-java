package com.example.demoChuong.service;

import com.example.demoChuong.dto.SachDTO;
import java.util.List;

public interface SachService {
    List<SachDTO> layTatCa();
    SachDTO layTheoId(Long id);
    SachDTO them(SachDTO dto);
    SachDTO sua(Long id, SachDTO dto);
    void xoa(Long id);
    List<SachDTO> timKiem(String tuKhoa);
}
