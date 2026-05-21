package com.hospital.system.service;

import com.hospital.system.entity.*;
import com.hospital.system.repository.*;
import com.hospital.system.websocket.QueueWebSocketHandler;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import java.util.Optional;

@Service
// @RequiredArgsConstructor
@Transactional
public class QueueService {

    private final QueueRepository queueRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final QueueWebSocketHandler wsHandler;

    @Autowired
    public QueueService(QueueRepository queueRepository,
                        PatientRepository patientRepository,
                        DoctorRepository doctorRepository,
                        QueueWebSocketHandler wsHandler
                    ){
        this.queueRepository = queueRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.wsHandler = wsHandler;
    }
    /** Lấy toàn bộ hàng đợi hôm nay, nhóm theo phòng */
    public List<Queue> getTodayQueue() {
        return queueRepository.findByQueueDateAndStatusOrderByQueueNumber(LocalDate.now());
    }

    public List<Queue> getByRoom(String roomName) {
        return queueRepository.findByQueueDateAndRoomNameOrderByQueueNumber(
                LocalDate.now(), roomName);
    }

    /** Tiếp nhận bệnh nhân vào hàng đợi */
    public Queue addToQueue(Long patientId, Long doctorId, String roomName,
                            String specialty, Queue.Priority priority, String notes) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Bệnh nhân không tồn tại"));
        Doctor doctor = doctorId != null
                ? doctorRepository.findById(doctorId).orElse(null) : null;

        int nextNum = queueRepository.findMaxQueueNumber(roomName, LocalDate.now())
                .orElse(0) + 1;

        Queue q = Queue.builder()
                .patient(patient)
                .doctor(doctor)
                .specialty(specialty)
                .roomName(roomName)
                .queueNumber(nextNum)
                .priority(priority)
                .status(Queue.Status.DANG_CHO)
                .checkInTime(LocalDateTime.now())
                .queueDate(LocalDate.now())
                .notes(notes)
                .build();

        Queue saved = queueRepository.save(q);
        broadcastQueueUpdate(roomName);
        return saved;
    }

    /** Gọi số tiếp theo trong phòng */
    public Queue callNext(String roomName) {
        // Hoàn thành người đang khám
        Optional<Queue> currentOpt = queueRepository.findCurrentInRoom(roomName, LocalDate.now());
        if (currentOpt.isPresent()) {
            Queue current = currentOpt.get();
            current.setStatus(Queue.Status.HOAN_THANH);
            current.setEndTime(LocalDateTime.now());
            queueRepository.save(current);
        }

        // Lấy người tiếp theo
        List<Queue> waiting = queueRepository.findByQueueDateAndRoomNameOrderByQueueNumber(LocalDate.now(), roomName);
        Queue next = null;
        for (Queue q : waiting) {
            if (q.getStatus() == Queue.Status.DANG_CHO || q.getStatus() == Queue.Status.DANG_KHAM) {
                if (next == null || priorityValue(q.getPriority()) < priorityValue(next.getPriority())) {
                    next = q;
                }
            }
        }
        
        if (next == null) {
            throw new RuntimeException("Không còn bệnh nhân chờ trong " + roomName);
        }
        next.setStatus(Queue.Status.DANG_KHAM);
        next.setStartTime(LocalDateTime.now());
        Queue saved = queueRepository.save(next);
        broadcastQueueUpdate(roomName);
        return saved;
    }

    private int priorityValue(Queue.Priority p) {
        if (p == Queue.Priority.CAP_CUU) return 0;
        if (p == Queue.Priority.UU_TIEN) return 1;
    return 2;
}

    public long countWaiting() {
        return queueRepository.countWaiting(LocalDate.now());
    }

    private void broadcastQueueUpdate(String roomName) {
        try {
            List<Queue> roomQueue = getByRoom(roomName);
            String json = buildQueueJson(roomName, roomQueue);
            wsHandler.broadcast(json);
        } catch (Exception e) {
            // Log only — don't break main flow
            System.err.println("WebSocket broadcast error: " + e.getMessage());
        }
    }

    private String buildQueueJson(String roomName, List<Queue> list) {
        Queue current = list.stream().filter(q -> q.getStatus() == Queue.Status.DANG_KHAM).findFirst().orElse(null);
        List<Queue> waiting = list.stream().filter(q -> q.getStatus() == Queue.Status.DANG_CHO).toList();
        StringBuilder sb = new StringBuilder();
        sb.append("{\"type\":\"QUEUE_UPDATE\",\"room\":\"").append(roomName).append("\"");
        if (current != null) {
            sb.append(",\"current\":{\"number\":").append(current.getQueueNumber())
              .append(",\"patient\":\"").append(current.getPatient().getFullName()).append("\"}");
        }
        sb.append(",\"waitingCount\":").append(waiting.size()).append("}");
        return sb.toString();
    }
}