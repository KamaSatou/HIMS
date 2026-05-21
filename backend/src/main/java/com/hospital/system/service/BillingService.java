package com.hospital.system.service;

import com.hospital.system.entity.*;
import com.hospital.system.repository.*;
// import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
// import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
// @RequiredArgsConstructor
@Transactional
public class BillingService {

    private final BillingRepository billingRepository;

    public BillingService(BillingRepository billingRepository){
        this.billingRepository = billingRepository;
    }


    public List<Billing> getAll() { return billingRepository.findAll(); }

    public Billing getById(Long id) {
        return billingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn ID: " + id));
    }

    public List<Billing> getByPatient(Long patientId) {
        return billingRepository.findByPatient_Id(patientId);
    }

    // public Billing create(Billing billing) {
    //     billing.setBillCode(generateCode());
    //     billing.setTotalAmount(
    //             .add(billing.getConsultationFee())
    //             .add(billing.getMedicineFee())
    //             .add(billing.getLabFee())
    //             .add(billing.getOtherFee())
    //     );
    //     return billingRepository.save(billing);
    // }

    public Billing pay(Long id, BigDecimal amount, Billing.PaymentMethod method) {
        Billing b = getById(id);
        b.setPaidAmount(amount);
        b.setPaymentMethod(method);
        b.setStatus(Billing.Status.DA_THANH_TOAN);
        b.setPaidAt(LocalDateTime.now());
        return billingRepository.save(b);
    }

    public BigDecimal getTodayRevenue() {
        return billingRepository.sumRevenueByDate(LocalDate.now())
                .orElse(BigDecimal.ZERO);
    }

    private String generateCode() {
        long count = billingRepository.count();
        return "BILL" + LocalDate.now().getYear() + String.format("%03d", count + 1);
    }
}