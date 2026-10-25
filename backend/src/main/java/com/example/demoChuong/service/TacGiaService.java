package com.example.demoChuong.service;

import com.example.demoChuong.dto.TacGiaDTO;
import java.util.List;

public interface TacGiaService {
    List<TacGiaDTO> layTatCa();
    TacGiaDTO layTheoId(Long id);
    TacGiaDTO them(TacGiaDTO dto);
    TacGiaDTO sua(Long id, TacGiaDTO dto);
    void xoa(Long id);
    List<TacGiaDTO> timKiem(String tuKhoa);
}
