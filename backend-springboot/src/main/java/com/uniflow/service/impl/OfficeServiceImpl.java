package com.uniflow.service.impl;

import com.uniflow.dto.request.OfficeRequest;
import com.uniflow.dto.response.OfficeResponse;
import com.uniflow.dto.response.ServiceResponse;
import com.uniflow.exception.BadRequestException;
import com.uniflow.exception.ResourceNotFoundException;
import com.uniflow.model.Office;
import com.uniflow.model.OfficeService;
import com.uniflow.repository.OfficeRepository;
import com.uniflow.repository.ServiceRepository;
import com.uniflow.service.OfficeManagementService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfficeServiceImpl implements OfficeManagementService {

    private final OfficeRepository officeRepository;
    private final ServiceRepository serviceRepository;

    public OfficeServiceImpl(OfficeRepository officeRepository, ServiceRepository serviceRepository) {
        this.officeRepository = officeRepository;
        this.serviceRepository = serviceRepository;
    }

    @Override
    @Transactional
    public OfficeResponse createOffice(OfficeRequest request) {
        if (officeRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Office with name '" + request.getName() + "' already exists");
        }

        Office office = new Office();
        office.setName(request.getName());
        office.setDescription(request.getDescription());
        office.setWorkingHoursStart(request.getWorkingHoursStart());
        office.setWorkingHoursEnd(request.getWorkingHoursEnd());
        office.setSlotDurationMinutes(request.getSlotDurationMinutes());
        office.setActive(true);

        Office savedOffice = officeRepository.save(office);

        return mapToOfficeResponse(savedOffice);
    }

    @Override
    @Transactional(readOnly = true)
    public OfficeResponse getOffice(Long officeId) {
        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new ResourceNotFoundException("Office not found"));
        return mapToOfficeResponse(office);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfficeResponse> getAllOffices() {
        List<Office> offices = officeRepository.findAll();
        return offices.stream()
                .map(this::mapToOfficeResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfficeResponse> getActiveOffices() {
        List<Office> offices = officeRepository.findByActiveTrue();
        return offices.stream()
                .map(this::mapToOfficeResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OfficeResponse updateOffice(Long officeId, OfficeRequest request) {
        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new ResourceNotFoundException("Office not found"));

        office.setName(request.getName());
        office.setDescription(request.getDescription());
        office.setWorkingHoursStart(request.getWorkingHoursStart());
        office.setWorkingHoursEnd(request.getWorkingHoursEnd());
        office.setSlotDurationMinutes(request.getSlotDurationMinutes());

        Office updatedOffice = officeRepository.save(office);

        return mapToOfficeResponse(updatedOffice);
    }

    @Override
    @Transactional
    public void deleteOffice(Long officeId) {
        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new ResourceNotFoundException("Office not found"));
        office.setActive(false);
        officeRepository.save(office);
    }

    @Override
    @Transactional
    public ServiceResponse addServiceToOffice(Long officeId, String serviceName, String description, Integer duration) {
        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new ResourceNotFoundException("Office not found"));

        OfficeService service = new OfficeService();
        service.setOffice(office);
        service.setName(serviceName);
        service.setDescription(description);
        service.setDurationMinutes(duration != null ? duration : 30);
        service.setActive(true);

        OfficeService savedService = serviceRepository.save(service);

        return mapToServiceResponse(savedService);
    }

    @Override
    public List<ServiceResponse> getOfficeServices(Long officeId) {
        List<OfficeService> services = serviceRepository.findByOfficeId(officeId);
        return services.stream()
                .map(this::mapToServiceResponse)
                .collect(Collectors.toList());
    }

    private OfficeResponse mapToOfficeResponse(Office office) {
        List<ServiceResponse> serviceResponses = office.getServices().stream()
                .map(this::mapToServiceResponse)
                .collect(Collectors.toList());

        return new OfficeResponse(
                office.getId(),
                office.getName(),
                office.getDescription(),
                office.getWorkingHoursStart(),
                office.getWorkingHoursEnd(),
                office.getSlotDurationMinutes(),
                office.isActive(),
                serviceResponses
        );
    }

    private ServiceResponse mapToServiceResponse(OfficeService service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getDurationMinutes(),
                service.isActive()
        );
    }
}