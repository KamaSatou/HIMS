package com.hospital.system.service;

import com.hospital.system.entity.Medicine;
import com.hospital.system.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public List<Medicine> getAll() { return medicineRepository.findAll(); }

    public Medicine getById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thuốc ID: " + id));
    }

    public List<Medicine> search(String query) {
        return medicineRepository.search(query);
    }

    public List<Medicine> getByCategory(String category) {
        return medicineRepository.findByCategory(category);
    }

    public List<Medicine> getLowStock() {
        return medicineRepository.findLowStock();
    }

    public List<Medicine> getTopConsumed(int limit) {
        return medicineRepository.findTopConsumed(PageRequest.of(0, limit));
    }

    public Medicine create(Medicine medicine) {
        long count = medicineRepository.count();
        medicine.setMedicineCode(String.format("MED%03d", count + 1));
        return medicineRepository.save(medicine);
    }

    public Medicine update(Long id, Medicine updated) {
        Medicine existing = getById(id);
        existing.setName(updated.getName());
        existing.setCategory(updated.getCategory());
        existing.setUnit(updated.getUnit());
        existing.setQuantity(updated.getQuantity());
        existing.setMaxQuantity(updated.getMaxQuantity());
        existing.setUnitPrice(updated.getUnitPrice());
        existing.setExpiryDate(updated.getExpiryDate());
        existing.setSupplier(updated.getSupplier());
        return medicineRepository.save(existing);
    }

    /** Nhập thêm hàng vào kho */
    public Medicine restock(Long id, int quantity) {
        Medicine m = getById(id);
        m.setQuantity(m.getQuantity() + quantity);
        return medicineRepository.save(m);
    }

    /** Trừ số lượng khi cấp phát */
    public void deductStock(Long id, int quantity) {
        Medicine m = getById(id);
        if (m.getQuantity() < quantity) {
            throw new RuntimeException("Không đủ tồn kho: " + m.getName());
        }
        m.setQuantity(m.getQuantity() - quantity);
        medicineRepository.save(m);
    }
}