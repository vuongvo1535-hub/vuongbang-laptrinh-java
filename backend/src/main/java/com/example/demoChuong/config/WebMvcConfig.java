package com.example.demoChuong.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cho phep truy cap cac file trong thu muc uploads
        File uploadDir = new File("uploads");
        String uploadPath = uploadDir.getAbsolutePath();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");

        // Cho phep truy cap cac anh trong public neu co
        File publicDir = new File("public");
        if (publicDir.exists()) {
            registry.addResourceHandler("/public/**", "/shop/**", "/admin/**", "/images/**")
                    .addResourceLocations(
                            "file:" + publicDir.getAbsolutePath() + "/",
                            "file:" + publicDir.getAbsolutePath() + "/shop/",
                            "file:" + publicDir.getAbsolutePath() + "/shop/images/",
                            "file:" + publicDir.getAbsolutePath() + "/admin/");
        }
    }
}
