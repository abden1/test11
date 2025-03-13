package com.freelancer.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotEmpty(message = "At least one technology must be specified")
    private List<String> technologiesUsed;
    
    // We'll get the freelancer ID from the authenticated user or path variable
} 