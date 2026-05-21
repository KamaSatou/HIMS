package com.hospital.system.controller;

import com.hospital.system.entity.Queue;
import com.hospital.system.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/queue")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    /** GET /api/queue — toàn bộ hàng đợi hôm nay (đang chờ) */
    @GetMapping
    public ResponseEntity<List<Map<String,Object>>> getToday() {
        List<Queue> queues = queueService.getTodayQueue();
        List<Map<String, Object>> result = queues.stream()
            .map(this::convertToMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    /** GET /api/queue/room/{roomName} */
    @GetMapping("/room/{roomName}")
    public ResponseEntity<List<Map<String,Object>>> getByRoom(@PathVariable String roomName) {
        List<Queue> queues = queueService.getByRoom(roomName);
        List<Map<String,Object>> result = queues.stream()
            .map(this::convertToMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    /** POST /api/queue — tiếp nhận bệnh nhân vào hàng đợi */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addToQueue(@RequestBody Map<String, Object> body) {
        Long patientId  = Long.valueOf(body.get("patientId").toString());
        Long doctorId   = body.get("doctorId") != null ? Long.valueOf(body.get("doctorId").toString()) : null;
        String roomName = body.get("roomName").toString();
        String specialty = body.get("specialty").toString();
        String priorityStr = body.getOrDefault("priority", "THUONG").toString();
        String notes    = body.getOrDefault("notes", "").toString();
        Queue.Priority priority = Queue.Priority.valueOf(priorityStr);
        Queue queue = queueService.addToQueue(patientId, doctorId, roomName, specialty, priority, notes);
        return ResponseEntity.ok(convertToMap(queue));
    }

    /** PATCH /api/queue/call-next — gọi số tiếp theo trong phòng */
    @PatchMapping("/call-next")
    public ResponseEntity<Map<String, Object>> callNext(@RequestParam String roomName) {
        Queue queue = queueService.callNext(roomName);
        return ResponseEntity.ok(convertToMap(queue));
    }

    /** GET /api/queue/stats */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(Map.of("waiting", queueService.countWaiting()));
    }

    private Map<String, Object> convertToMap(Queue queue) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", queue.getId());
        map.put("queueNumber", queue.getQueueNumber());
        map.put("status", queue.getStatus() != null ? queue.getStatus().name() : null);
        map.put("roomName", queue.getRoomName());
        map.put("specialty", queue.getSpecialty());
        map.put("priority", queue.getPriority() != null ? queue.getPriority().name() : null);
        map.put("checkInTime", queue.getCheckInTime() != null ? queue.getCheckInTime().toString() : null);
        map.put("startTime", queue.getStartTime() != null ? queue.getStartTime().toString() : null);
        map.put("endTime", queue.getEndTime() != null ? queue.getEndTime().toString() : null);
        map.put("queueDate", queue.getQueueDate() != null ? queue.getQueueDate().toString() : null);
        map.put("notes", queue.getNotes());
        
        // Patient info (an toàn, không bị proxy)
        if (queue.getPatient() != null) {
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("id", queue.getPatient().getId());
            p.put("fullName", queue.getPatient().getFullName());
            p.put("patientCode", queue.getPatient().getPatientCode());
            map.put("patient", p);  // ← Key là "patient"
        }else{
            map.put("patient", null);
        }
        
        // Doctor info (an toàn, không bị proxy)
        if (queue.getDoctor() != null) {
            Map<String, Object> doctorMap = new LinkedHashMap<>();
            doctorMap.put("id", queue.getDoctor().getId());
            doctorMap.put("fullName", queue.getDoctor().getFullName());
            doctorMap.put("specialty", queue.getDoctor().getSpecialty());
            map.put("doctor", doctorMap);
        }
        
        return map;
    }
}