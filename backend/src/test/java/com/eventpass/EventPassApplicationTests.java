package com.eventpass;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class EventPassApplicationTests {

    @Test
    void contextLoads() {
        // Confirms Spring Boot 3 context boots up successfully with all configurations
    }
}
