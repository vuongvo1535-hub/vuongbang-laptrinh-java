package com.example.demoChuong.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String tenDoiTuong, Long id) {
        super("Không tìm thấy " + tenDoiTuong + " với id = " + id);
    }
}
