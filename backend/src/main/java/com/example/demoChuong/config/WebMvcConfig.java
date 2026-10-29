package com.example.demoChuong.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cho phep CORS de frontend tren cong 3000 hoac cac client khac tai anh va goi API
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Tim thu muc uploads
        File uploadDir = timThuMuc("uploads");
        if (uploadDir != null && uploadDir.exists()) {
            String uploadPath = uploadDir.getAbsolutePath().replace("\\", "/");
            if (!uploadPath.endsWith("/")) {
                uploadPath += "/";
            }
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations("file:" + uploadPath);
        }

        // Tim thu muc public trong backend
        File publicDir = timThuMuc("public");
        if (publicDir != null && publicDir.exists()) {
            String publicPath = publicDir.getAbsolutePath().replace("\\", "/");
            if (!publicPath.endsWith("/")) {
                publicPath += "/";
            }

            // 1. /public/** -> backend/public/
            registry.addResourceHandler("/public/**")
                    .addResourceLocations("file:" + publicPath);

            // 2. /shop/** -> backend/public/shop/ (phuc vu /shop/images/sach/DEMOxxx.jpg)
            registry.addResourceHandler("/shop/**")
                    .addResourceLocations("file:" + publicPath + "shop/");

            // 3. /images/** -> backend/public/shop/images/ (phuc vu /images/sach/DEMOxxx.jpg)
            registry.addResourceHandler("/images/**")
                    .addResourceLocations("file:" + publicPath + "shop/images/");

            // 4. /admin/** -> backend/public/admin/
            File adminDir = new File(publicDir, "admin");
            if (adminDir.exists()) {
                registry.addResourceHandler("/admin/**")
                        .addResourceLocations("file:" + publicPath + "admin/");
            }
        }
    }

    /**
     * Ho tro tim dung thu muc du chay backend tu thu muc goc hay tu thu muc backend.
     */
    private File timThuMuc(String tenThuMuc) {
        File dir = new File(tenThuMuc);
        if (dir.exists()) {
            return dir;
        }
        File backendDir = new File("backend", tenThuMuc);
        if (backendDir.exists()) {
            return backendDir;
        }
        return dir;
    }
}

