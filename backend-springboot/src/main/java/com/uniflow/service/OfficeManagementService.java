package com.uniflow.service;

import com.uniflow.dto.request.OfficeRequest;
import com.uniflow.dto.response.OfficeResponse;
import com.uniflow.dto.response.ServiceResponse;

import java.util.List;

public interface OfficeManagementService {
    OfficeResponse createOffice(OfficeRequest request);
    OfficeResponse getOffice(Long officeId);
    List<OfficeResponse> getAllOffices();
    List<OfficeResponse> getActiveOffices();
    OfficeResponse updateOffice(Long officeId, OfficeRequest request);
    void deleteOffice(Long officeId);
    ServiceResponse addServiceToOffice(Long officeId, String serviceName, String description, Integer duration);
    List<ServiceResponse> getOfficeServices(Long officeId);
}