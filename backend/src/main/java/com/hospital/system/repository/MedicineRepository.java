package com.hospital.system.repository;

import com.hospital.system.entity.Medicine;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByCategory(String category);

    @Query("SELECT m FROM Medicine m WHERE m.quantity <= m.lowStockAlert")
    List<Medicine> findLowStock();

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :q, '%')) OR m.medicineCode LIKE CONCAT('%', :q, '%')")
    List<Medicine> search(@Param("q") String query);

    @Query("SELECT m FROM Medicine m ORDER BY m.quantity DESC")
    List<Medicine> findTopConsumed(org.springframework.data.domain.Pageable pageable);
}