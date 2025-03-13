package com.freelancer.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerResponse {
    private Long id;
    private String name;
    private String email;
    private String specialization;
    private Integer yearsOfExperience;
    private Double hourlyRate;
} 