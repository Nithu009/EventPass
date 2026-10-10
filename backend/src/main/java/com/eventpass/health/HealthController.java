package com.eventpass.health;

import com.eventpass.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health & System", description = "Endpoints for monitoring server health and MongoDB Atlas status")
public class HealthController {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public HealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping
    @Operation(summary = "Check service and MongoDB Atlas status", description = "Returns the operational status of the EventPass backend and MongoDB Atlas connectivity")
    public ResponseEntity<ApiResponse<HealthResponse>> checkHealth() {
        String dbStatus;
        Map<String, Object> details = new HashMap<>();
        details.put("javaVersion", System.getProperty("java.version"));
        details.put("os", System.getProperty("os.name"));
        details.put("databaseType", "MongoDB Atlas (Replica Set)");

        try {
            Document pingResult = mongoTemplate.executeCommand(new Document("ping", 1));
            Double okVal = pingResult.get("ok", Number.class) != null ? pingResult.get("ok", Number.class).doubleValue() : 0.0;
            boolean ok = okVal == 1.0;
            dbStatus = ok ? "CONNECTED (MongoDB Atlas)" : "UNREACHABLE";
            details.put("ping", pingResult.toJson());
        } catch (Exception e) {
            dbStatus = "DISCONNECTED: " + e.getMessage();
            details.put("dbError", e.getMessage());
        }

        HealthResponse healthResponse = new HealthResponse(
                "UP",
                "EventPass Ticketing API",
                "1.0.0",
                dbStatus,
                details
        );

        return ResponseEntity.ok(ApiResponse.success("System is operational", healthResponse));
    }
}
