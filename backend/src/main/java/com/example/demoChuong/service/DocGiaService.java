package com.example.demoChuong.service;

import com.example.demoChuong.dto.DocGiaDTO;
import java.util.List;

public interface DocGiaService {
    List<DocGiaDTO> layTatCa();
    DocGiaDTO layTheoId(Long id);
    DocGiaDTO them(DocGiaDTO dto);
    DocGiaDTO sua(Long id, DocGiaDTO dto);
    void xoa(Long id);
    List<DocGiaDTO> timKiem(String tuKhoa);
}
