package com.hospital.system.repository;

import com.hospital.system.entity.Billing;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

public interface BillingRepository extends JpaRepository<Billing, Long> {
    List<Billing> findByPatient_Id(Long patientId);
    List<Billing> findByStatus(Billing.Status status);

    @Query("SELECT SUM(b.paidAmount) FROM Billing b WHERE DATE(b.paidAt) = :date AND b.status = 'DA_THANH_TOAN'")
    Optional<BigDecimal> sumRevenueByDate(@Param("date") LocalDate date);
}