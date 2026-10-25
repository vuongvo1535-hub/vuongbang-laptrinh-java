package com.example.demoChuong.service;

import com.example.demoChuong.dto.NhaXuatBanDTO;
import java.util.List;

public interface NhaXuatBanService {
    List<NhaXuatBanDTO> layTatCa();
    NhaXuatBanDTO layTheoId(Long id);
    NhaXuatBanDTO them(NhaXuatBanDTO dto);
    NhaXuatBanDTO sua(Long id, NhaXuatBanDTO dto);
    void xoa(Long id);
}
