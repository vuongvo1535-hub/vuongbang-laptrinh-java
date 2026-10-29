package com.example.demoChuong.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String tenDoiTuong, Long id) {
        super("Không tìm thấy " + tenDoiTuong + " với id = " + id);
    }

    public ResourceNotFoundException(String tenDoiTuong, String thongTin) {
        super("Không tìm thấy " + tenDoiTuong + " với " + thongTin);
    }
}
