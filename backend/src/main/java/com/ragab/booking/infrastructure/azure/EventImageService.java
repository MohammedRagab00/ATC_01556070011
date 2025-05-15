package com.ragab.booking.infrastructure.azure;

import com.ragab.booking.core.event.model.Event;
import com.ragab.booking.core.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import static com.ragab.booking.infrastructure.azure.AzureStorageService.ALLOWED_TYPES;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
@Slf4j
public class EventImageService {
    private final AzureStorageService azureStorageService;
    private final EventRepository eventRepository;

    @Value("${azure.storage.container-name}")
    private String CONTAINER_NAME;

    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB limit for event images

    public void updateEventImage(Integer eventId, MultipartFile file) {
        Event event = getEventById(eventId);

        String filename = "event_images/" + event.getId() + azureStorageService.getFileExtension(file);
        String blobName = azureStorageService.uploadFile(file, CONTAINER_NAME, filename, MAX_SIZE, ALLOWED_TYPES);

        event.setImageUrl(blobName);
        eventRepository.save(event);
    }

    public void deleteEventImage(Integer eventId) {
        Event event = getEventById(eventId);

        if (event.getImageUrl() != null) {
            azureStorageService.deleteFile(event.getImageUrl(), CONTAINER_NAME);
            event.setImageUrl(null);
            eventRepository.save(event);
        }
    }

    public String getImageUrl(String imageName) {
        return imageName == null ? null : azureStorageService.getBlobUrlWithSas(CONTAINER_NAME, imageName);
    }

    private Event getEventById(Integer eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
    }
}