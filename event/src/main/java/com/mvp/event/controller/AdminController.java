package com.mvp.event.controller;

import com.mvp.event.dto.response.ReportResponse;
import com.mvp.event.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ReportService reportService;

    /** Admin – system-wide report */
    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponse> getReport() {
        return ResponseEntity.ok(reportService.generateReport());
    }
}
