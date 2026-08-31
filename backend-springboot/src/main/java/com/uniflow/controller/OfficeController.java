package com.uniflow.controller;

import com.uniflow.dto.request.OfficeRequest;
import com.uniflow.dto.response.OfficeResponse;
import com.uniflow.dto.response.ServiceResponse;
import com.uniflow.service.OfficeManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/offices")
public class OfficeController {

    private final OfficeManagementService officeService;

    // Explicit constructor
    public OfficeController(OfficeManagementService officeService) {
        this.officeService = officeService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OfficeResponse> createOffice(@Valid @RequestBody OfficeRequest request) {
        OfficeResponse response = officeService.createOffice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<OfficeResponse>> getAllOffices() {
        List<OfficeResponse> responses = officeService.getAllOffices();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/active")
    public ResponseEntity<List<OfficeResponse>> getActiveOffices() {
        List<OfficeResponse> responses = officeService.getActiveOffices();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{officeId}")
    public ResponseEntity<OfficeResponse> getOffice(@PathVariable Long officeId) {
        OfficeResponse response = officeService.getOffice(officeId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{officeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OfficeResponse> updateOffice(
            @PathVariable Long officeId,
            @Valid @RequestBody OfficeRequest request) {
        OfficeResponse response = officeService.updateOffice(officeId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{officeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOffice(@PathVariable Long officeId) {
        officeService.deleteOffice(officeId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{officeId}/services")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceResponse> addServiceToOffice(
            @PathVariable Long officeId,
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer duration) {
        ServiceResponse response = officeService.addServiceToOffice(officeId, name, description, duration);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{officeId}/services")
    public ResponseEntity<List<ServiceResponse>> getOfficeServices(@PathVariable Long officeId) {
        List<ServiceResponse> responses = officeService.getOfficeServices(officeId);
        return ResponseEntity.ok(responses);
    }
}