package com.example.demoChuong.service;

import com.example.demoChuong.dto.BanSaoSachDTO;
import java.util.List;

public interface BanSaoSachService {
    List<BanSaoSachDTO> layTatCa();
    List<BanSaoSachDTO> layTheoSachId(Long sachId);
    BanSaoSachDTO layTheoId(Long id);
    BanSaoSachDTO layTheoMaVach(String maVach);
    BanSaoSachDTO them(BanSaoSachDTO dto);
    BanSaoSachDTO sua(Long id, BanSaoSachDTO dto);
    void xoa(Long id);
}
