package com.freelancer.management.service;

import com.freelancer.management.dto.FreelancerRegistrationRequest;
import com.freelancer.management.dto.FreelancerResponse;
import com.freelancer.management.model.Freelancer;
import com.freelancer.management.repository.FreelancerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FreelancerService {
    
    private final FreelancerRepository freelancerRepository;
    
    @Transactional
    public FreelancerResponse registerFreelancer(FreelancerRegistrationRequest request) {
        if (freelancerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        
        Freelancer freelancer = Freelancer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword()) // In a real application, this should be encrypted
                .specialization(request.getSpecialization())
                .yearsOfExperience(request.getYearsOfExperience())
                .hourlyRate(request.getHourlyRate())
                .createdAt(LocalDateTime.now())
                .accountStatus("ACTIVE")
                .build();
        
        Freelancer savedFreelancer = freelancerRepository.save(freelancer);
        
        return mapToFreelancerResponse(savedFreelancer);
    }
    
    public FreelancerResponse getFreelancerById(Long id) {
        Freelancer freelancer = freelancerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Freelancer not found with id: " + id));
        
        return mapToFreelancerResponse(freelancer);
    }
    
    private FreelancerResponse mapToFreelancerResponse(Freelancer freelancer) {
        return FreelancerResponse.builder()
                .id(freelancer.getId())
                .name(freelancer.getName())
                .email(freelancer.getEmail())
                .specialization(freelancer.getSpecialization())
                .yearsOfExperience(freelancer.getYearsOfExperience())
                .hourlyRate(freelancer.getHourlyRate())
                .build();
    }
} 