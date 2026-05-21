package com.hospital.system.repository;

import com.hospital.system.entity.Queue;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.*;

public interface QueueRepository extends JpaRepository<Queue, Long> {

    @Query("SELECT q FROM Queue q WHERE q.queueDate = :date ORDER BY q.roomName, q.queueNumber")
    List<Queue> findByQueueDateAndStatusOrderByQueueNumber(LocalDate date);

    @Query("SELECT q FROM Queue q WHERE q.roomName = :room AND q.queueDate = :date ORDER BY q.queueNumber")
    List<Queue> findByRoomNameAndQueueDate(@Param("room") String room, @Param("date") LocalDate date);

    @Query("SELECT MAX(q.queueNumber) FROM Queue q WHERE q.roomName = :room AND q.queueDate = :date")
    Optional<Integer> findMaxQueueNumber(@Param("room") String room, @Param("date") LocalDate date);

    @Query("SELECT q FROM Queue q WHERE q.roomName = :room AND q.queueDate = :date AND q.status = 'DANG_KHAM'")
    Optional<Queue> findCurrentInRoom(@Param("room") String room, @Param("date") LocalDate date);

    @Query("SELECT q FROM Queue q WHERE q.queueDate = :date AND q.status IN ('DANG_CHO', 'DANG_KHAM') ORDER BY q.roomName, q.queueNumber")
    List<Queue> findByQueueDateAndRoomNameOrderByQueueNumber(@Param("date") LocalDate date);

    List<Queue> findByQueueDateAndRoomNameOrderByQueueNumber(LocalDate date, String roomName);

    @Query("SELECT COUNT(q) FROM Queue q WHERE q.queueDate = :date AND q.status = 'DANG_CHO'")
    long countWaiting(@Param("date") LocalDate date);

    // Tìm TẤT CẢ queue của một patient
    @Query("SELECT q FROM Queue q WHERE q.patient.id = :patientId")
    List<Queue> findByPatientId(@Param("patientId") Long patientId);
    
    // Tìm queue của patient theo danh sách status
    @Query("SELECT q FROM Queue q WHERE q.patient.id = :patientId AND q.status IN :statuses")
    List<Queue> findByPatientIdAndStatusIn(
        @Param("patientId") Long patientId, 
        @Param("statuses") List<Queue.Status> statuses
    );

    // Xóa tất cả queue của một patient
    @Modifying
    @Query(value = "DELETE FROM queue WHERE patient_id = :patientId", nativeQuery = true)
    void deleteByPatientId(@Param("patientId") Long patientId);

    // Kiểm tra patient có queue active không
    @Query("SELECT COUNT(q) > 0 FROM Queue q WHERE q.patient.id = :patientId AND q.status IN ('DANG_CHO')")
    boolean hasActiveQueue(@Param("patientId") Long patientId);
}