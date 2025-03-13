package com.freelancer.management.controller;

import com.freelancer.management.dto.FreelancerRegistrationRequest;
import com.freelancer.management.dto.FreelancerResponse;
import com.freelancer.management.service.FreelancerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FreelancerController {
    
    private final FreelancerService freelancerService;
    
    @PostMapping("/register")
    public ResponseEntity<FreelancerResponse> registerFreelancer(
            @Valid @RequestBody FreelancerRegistrationRequest request) {
        FreelancerResponse response = freelancerService.registerFreelancer(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/freelancers/{id}")
    public ResponseEntity<FreelancerResponse> getFreelancerById(@PathVariable Long id) {
        FreelancerResponse response = freelancerService.getFreelancerById(id);
        return ResponseEntity.ok(response);
    }
} 