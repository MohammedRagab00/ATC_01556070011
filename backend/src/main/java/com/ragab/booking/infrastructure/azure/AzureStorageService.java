package com.ragab.booking.infrastructure.azure;


import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import com.ragab.booking.common.exception.custom.FileValidationException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.List;

import static com.azure.storage.common.sas.SasProtocol.HTTPS_ONLY;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
@Slf4j
public class AzureStorageService {
    private final BlobServiceClient blobServiceClient;

    public static final List<String> ALLOWED_TYPES = List.of(
            "image/jpeg", "image/png", "image/jpg"
    );

    @PostConstruct
    public void initialize() {
        if (blobServiceClient == null) {
            throw new IllegalStateException("BlobServiceClient not configured");
        }
    }

    public String uploadFile(MultipartFile file, String containerName, String filename,
                             long maxSize, List<String> allowedTypes) {
        validateFile(file, maxSize, allowedTypes);

        try {
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
            BlobClient blobClient = containerClient.getBlobClient(filename);

            BlobHttpHeaders headers = new BlobHttpHeaders()
                    .setContentType(file.getContentType());

            blobClient.upload(file.getInputStream(), file.getSize(), true);
            blobClient.setHttpHeaders(headers);

            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public void deleteFile(String blobName, String containerName) {
        try {
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
            BlobClient blobClient = containerClient.getBlobClient(blobName);

            if (blobClient.exists()) {
                blobClient.delete();
            }
        } catch (Exception e) {
            log.error("Error deleting file: {}", e.getMessage());
        }
    }

    public String getBlobUrlWithSas(String containerName, String blobName) {
        if (blobName == null || blobName.isEmpty()) {
            return null;
        }

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        OffsetDateTime expiryTime = OffsetDateTime.now().plusDays(1);
        BlobSasPermission permission = new BlobSasPermission()
                .setReadPermission(true);

        BlobServiceSasSignatureValues values = new BlobServiceSasSignatureValues(expiryTime, permission)
                .setProtocol(HTTPS_ONLY);

        String sasToken = blobClient.generateSas(values);
        return blobClient.getBlobUrl() + "?" + sasToken;
    }

    private void validateFile(MultipartFile file, long maxSize, List<String> allowedTypes) {
        if (file.isEmpty()) {
            throw new FileValidationException("File cannot be empty");
        }

        if (file.getSize() > maxSize) {
            throw new FileValidationException("File size exceeds maximum allowed size");
        }

        String contentType = file.getContentType();

        String filename = file.getOriginalFilename();
        if (filename != null && filename.endsWith(".gltf")) {
            return;
        }

        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new FileValidationException("Invalid file type. Allowed types: " + allowedTypes);
        }
    }

    public String getFileExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        return originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
    }
}