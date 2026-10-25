package com.example.demoChuong.service;

import com.example.demoChuong.dto.DanhMucDTO;
import java.util.List;

public interface DanhMucService {
    List<DanhMucDTO> layTatCa();
    DanhMucDTO layTheoId(Long id);
    DanhMucDTO them(DanhMucDTO dto);
    DanhMucDTO sua(Long id, DanhMucDTO dto);
    void xoa(Long id);
}
