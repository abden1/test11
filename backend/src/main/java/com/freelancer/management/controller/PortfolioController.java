package com.freelancer.management.controller;

import com.freelancer.management.dto.ProjectRequest;
import com.freelancer.management.dto.ProjectResponse;
import com.freelancer.management.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/portfolio")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PortfolioController {
    
    private final ProjectService projectService;
    
    @PostMapping("/add")
    public ResponseEntity<ProjectResponse> addProject(
            @RequestParam Long freelancerId,
            @Valid @RequestBody ProjectRequest request) {
        ProjectResponse response = projectService.addProject(freelancerId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ProjectResponse>> searchProjects(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<ProjectResponse> projects = projectService.searchProjectsPaginated(query, page, size);
        return ResponseEntity.ok(projects);
    }
    
    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByFreelancerId(
            @PathVariable Long freelancerId) {
        List<ProjectResponse> projects = projectService.getProjectsByFreelancerId(freelancerId);
        return ResponseEntity.ok(projects);
    }
} 