package com.example.demoapp.repository;

import com.example.demoapp.entity.BaseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity> extends JpaRepository<T, Long>, JpaSpecificationExecutor<T> {

    /**
     * Find all active entities
     */
    
    @Query("SELECT e FROM #{#entityName} e WHERE e.active = true")
    List<T> findAllActive();
    
    /**
     * Find all active entities with pagination
     */
    
    @Query("SELECT e FROM #{#entityName} e WHERE e.active = true")
    Page<T> findAllActive(Pageable pageable);
    

    /**
     * Find active entity by ID
     */
    
    @Query("SELECT e FROM #{#entityName} e WHERE e.id = :id AND e.active = true")
    Optional<T> findActiveById(@Param("id") Long id);
    

    /**
     * Soft delete entity by ID
     */
    
    @Modifying
    @Query("UPDATE #{#entityName} e SET e.active = false, e.updatedAt = :updatedAt WHERE e.id = :id")
    int softDeleteById(@Param("id") Long id, @Param("updatedAt") LocalDateTime updatedAt);
    

    /**
     * Soft delete entity
     */
    default void softDelete(T entity) {
        entity.setActive(false);
        entity.setUpdatedAt(LocalDateTime.now());
        save(entity);
    }

    /**
     * Find entities created between dates
     */
    
    @Query("SELECT e FROM #{#entityName} e WHERE e.createdAt BETWEEN :startDate AND :endDate AND e.active = true")
    List<T> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);
    /**
     * Find entities modified after date
     */
    @Query("SELECT e FROM #{#entityName} e WHERE e.updatedAt > :date AND e.active = true")
    List<T> findModifiedAfter(@Param("date") LocalDateTime date);

    /**
     * Count active entities
     */
    @Query("SELECT COUNT(e) FROM #{#entityName} e WHERE e.active = true")
    long countActive();

    /**
     * Check if entity exists and is active
     */
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM #{#entityName} e WHERE e.id = :id AND e.active = true")
    boolean existsActiveById(@Param("id") Long id);
    

}