package com.example.demoChuong.service;

import com.example.demoChuong.dto.DangKyRequest;
import com.example.demoChuong.dto.DangNhapRequest;
import com.example.demoChuong.dto.DangNhapResponse;

public interface AuthService {
    DangNhapResponse dangNhap(DangNhapRequest req);
    DangNhapResponse dangKy(DangKyRequest req);
    DangNhapResponse layThongTinMe(Long taiKhoanId);
}
