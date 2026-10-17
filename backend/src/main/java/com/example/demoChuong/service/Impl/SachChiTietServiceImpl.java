package com.example.demoChuong.service.Impl;

import com.example.demoChuong.dto.SachChiTietDTO;
import com.example.demoChuong.dto.TacGiaDTO;
import com.example.demoChuong.entity.DanhMuc;
import com.example.demoChuong.entity.NhaXuatBan;
import com.example.demoChuong.entity.Sach;
import com.example.demoChuong.exception.ResourceNotFoundException;
import com.example.demoChuong.repository.BanSaoSachRepository;
import com.example.demoChuong.repository.DanhMucRepository;
import com.example.demoChuong.repository.NhaXuatBanRepository;
import com.example.demoChuong.repository.SachRepository;
import com.example.demoChuong.repository.TacGiaRepository;
import com.example.demoChuong.service.SachChiTietService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SachChiTietServiceImpl implements SachChiTietService {

    private final SachRepository sachRepository;
    private final DanhMucRepository danhMucRepository;
    private final NhaXuatBanRepository nhaXuatBanRepository;
    private final TacGiaRepository tacGiaRepository;
    private final BanSaoSachRepository banSaoSachRepository;

    public SachChiTietServiceImpl(SachRepository sachRepository,
                                  DanhMucRepository danhMucRepository,
                                  NhaXuatBanRepository nhaXuatBanRepository,
                                  TacGiaRepository tacGiaRepository,
                                  BanSaoSachRepository banSaoSachRepository) {
        this.sachRepository = sachRepository;
        this.danhMucRepository = danhMucRepository;
        this.nhaXuatBanRepository = nhaXuatBanRepository;
        this.tacGiaRepository = tacGiaRepository;
        this.banSaoSachRepository = banSaoSachRepository;
    }

    @Override
    public SachChiTietDTO layChiTiet(Long sachId) {
        Sach sach = sachRepository.findById(sachId)
                .orElseThrow(() -> new ResourceNotFoundException("sách", sachId));

        String tenDanhMuc = null;
        if (sach.getDanhMucId() != null) {
            tenDanhMuc = danhMucRepository.findById(sach.getDanhMucId())
                    .map(DanhMuc::getTenDanhMuc)
                    .orElse(null);
        }

        String tenNhaXuatBan = null;
        if (sach.getNhaXuatBanId() != null) {
            tenNhaXuatBan = nhaXuatBanRepository.findById(sach.getNhaXuatBanId())
                    .map(NhaXuatBan::getTenNhaXuatBan)
                    .orElse(null);
        }

        List<TacGiaDTO> tacGia = tacGiaRepository.timTheoSachId(sachId).stream()
                .map(tg -> new TacGiaDTO(tg.getId(), tg.getTenTacGia(), tg.getQuocTich()))
                .toList();

        // Ban sao da thanh ly khong tinh vao tong so ban
        long tongSoBan = banSaoSachRepository.countBySachIdAndTrangThaiNot(sachId, "THANH_LY");
        long soBanSanSang = banSaoSachRepository.countBySachIdAndTrangThai(sachId, "SAN_SANG");

        return new SachChiTietDTO(sachId, tenDanhMuc, tenNhaXuatBan, tacGia, tongSoBan, soBanSanSang);
    }
}
