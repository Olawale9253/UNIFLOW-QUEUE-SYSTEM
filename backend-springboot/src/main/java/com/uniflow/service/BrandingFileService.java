package com.uniflow.service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface BrandingFileService {
    String save(MultipartFile file) throws IOException;

    ResponseEntity<Resource> load(String filename);
}