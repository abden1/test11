package com.freelancer.management.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "freelancers")
public class Freelancer extends User {

    @Column(name = "specialization", nullable = false)
    private String specialization;
    
    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;
    
    @Column(name = "hourly_rate")
    private Double hourlyRate;
    
    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Project> projects = new ArrayList<>();
    
    // Helper method to add a project
    public void addProject(Project project) {
        projects.add(project);
        project.setFreelancer(this);
    }
    
    // Helper method to remove a project
    public void removeProject(Project project) {
        projects.remove(project);
        project.setFreelancer(null);
    }
} 