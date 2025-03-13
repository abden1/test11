package com.freelancer.management.service;

import com.freelancer.management.dto.FreelancerResponse;
import com.freelancer.management.dto.ProjectRequest;
import com.freelancer.management.dto.ProjectResponse;
import com.freelancer.management.model.Freelancer;
import com.freelancer.management.model.Project;
import com.freelancer.management.repository.FreelancerRepository;
import com.freelancer.management.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final FreelancerRepository freelancerRepository;
    
    @Transactional
    public ProjectResponse addProject(Long freelancerId, ProjectRequest request) {
        Freelancer freelancer = freelancerRepository.findById(freelancerId)
                .orElseThrow(() -> new IllegalArgumentException("Freelancer not found with id: " + freelancerId));
        
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .technologiesUsed(request.getTechnologiesUsed())
                .createdAt(LocalDateTime.now())
                .freelancer(freelancer)
                .build();
        
        Project savedProject = projectRepository.save(project);
        
        return mapToProjectResponse(savedProject);
    }
    
    public List<ProjectResponse> searchProjects(String query) {
        List<Project> projects = projectRepository.searchByTitleOrTechnologies(query);
        return projects.stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProjectResponse> searchProjectsPaginated(String query, int page, int size) {
        List<Project> projects = projectRepository.searchByTitleOrTechnologiesPaginated(query, size, page * size);
        return projects.stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProjectResponse> getProjectsByFreelancerId(Long freelancerId) {
        List<Project> projects = projectRepository.findByFreelancerId(freelancerId);
        return projects.stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }
    
    private ProjectResponse mapToProjectResponse(Project project) {
        Freelancer freelancer = project.getFreelancer();
        
        FreelancerResponse freelancerResponse = FreelancerResponse.builder()
                .id(freelancer.getId())
                .name(freelancer.getName())
                .email(freelancer.getEmail())
                .specialization(freelancer.getSpecialization())
                .yearsOfExperience(freelancer.getYearsOfExperience())
                .hourlyRate(freelancer.getHourlyRate())
                .build();
        
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .technologiesUsed(project.getTechnologiesUsed())
                .createdAt(project.getCreatedAt())
                .freelancer(freelancerResponse)
                .build();
    }
} 