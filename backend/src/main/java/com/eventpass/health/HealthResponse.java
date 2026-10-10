package com.eventpass.health;

import java.util.Map;

public class HealthResponse {
    private String status;
    private String service;
    private String version;
    private String database;
    private Map<String, Object> details;

    public HealthResponse() {}

    public HealthResponse(String status, String service, String version, String database, Map<String, Object> details) {
        this.status = status;
        this.service = service;
        this.version = version;
        this.database = database;
        this.details = details;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }
}
