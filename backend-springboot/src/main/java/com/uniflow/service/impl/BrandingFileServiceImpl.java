package com.uniflow.service.impl;

import com.uniflow.service.BrandingFileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.UUID;

@Service
public class BrandingFileServiceImpl implements BrandingFileService {
    private final Path imageDirectory;

    public BrandingFileServiceImpl(@Value("${app.upload-dir:uploads/images}") String uploadDirectory) throws IOException {
        imageDirectory = Paths.get(uploadDirectory).toAbsolutePath().normalize();
        Files.createDirectories(imageDirectory);
    }

    @Override
    public String save(MultipartFile file) throws IOException {
        if (file.isEmpty() || file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are supported");
        }

        String extension = extensionFor(file.getOriginalFilename(), file.getContentType());
        String filename = UUID.randomUUID() + extension;
        file.transferTo(imageDirectory.resolve(filename));
        return "/api/system/settings/logo/" + filename;
    }

    @Override
    public ResponseEntity<Resource> load(String filename) {
        Path requested = imageDirectory.resolve(filename).normalize();
        if (!requested.startsWith(imageDirectory)) {
            return ResponseEntity.badRequest().build();
        }

        Resource resource = new FileSystemResource(requested);
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = MediaTypeFactory.getMediaType(filename).orElse(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok().contentType(mediaType).body(resource);
    }

    private String extensionFor(String originalFilename, String contentType) {
        String filename = originalFilename == null ? "" : originalFilename.toLowerCase(Locale.ROOT);
        if (filename.endsWith(".png")) return ".png";
        if (filename.endsWith(".gif")) return ".gif";
        if (filename.endsWith(".webp")) return ".webp";
        if (filename.endsWith(".svg")) return ".svg";
        return contentType.endsWith("jpeg") ? ".jpg" : ".img";
    }
}