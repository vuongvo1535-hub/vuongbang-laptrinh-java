package com.example.demoChuong;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DemoChuongApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoChuongApplication.class, args);
    }
}
