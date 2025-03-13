package com.freelancer.management.repository;

import com.freelancer.management.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByFreelancerId(Long freelancerId);
    
    // PostgreSQL full-text search query using ts_query and plainto_tsquery
    @Query(value = "SELECT p.* FROM projects p " +
            "WHERE p.title_tsv @@ plainto_tsquery('english', :query) " +
            "OR p.technologies_tsv @@ plainto_tsquery('english', :query) " +
            "ORDER BY ts_rank(p.title_tsv, plainto_tsquery('english', :query)) + " +
            "ts_rank(p.technologies_tsv, plainto_tsquery('english', :query)) DESC", 
            nativeQuery = true)
    List<Project> searchByTitleOrTechnologies(@Param("query") String query);
    
    // Pagination version of the search
    @Query(value = "SELECT p.* FROM projects p " +
            "WHERE p.title_tsv @@ plainto_tsquery('english', :query) " +
            "OR p.technologies_tsv @@ plainto_tsquery('english', :query) " +
            "ORDER BY ts_rank(p.title_tsv, plainto_tsquery('english', :query)) + " +
            "ts_rank(p.technologies_tsv, plainto_tsquery('english', :query)) DESC " +
            "LIMIT :limit OFFSET :offset", 
            nativeQuery = true)
    List<Project> searchByTitleOrTechnologiesPaginated(
            @Param("query") String query, 
            @Param("limit") int limit, 
            @Param("offset") int offset);
} 