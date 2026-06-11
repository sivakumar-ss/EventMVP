package com.eventapp.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseFixConfig {

    @Bean
    @Order(1)
    public CommandLineRunner updateSchema(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Drop the constraint that restricts role values to old enum values
                jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
                jdbcTemplate.execute("ALTER TABLE registrations ADD COLUMN IF NOT EXISTS status VARCHAR(255)");
                jdbcTemplate.execute("ALTER TABLE registrations ADD COLUMN IF NOT EXISTS utr_number VARCHAR(255)");
                jdbcTemplate.execute("ALTER TABLE registrations ADD COLUMN IF NOT EXISTS payment_screenshot VARCHAR(1000)");
                jdbcTemplate.execute("ALTER TABLE events ADD COLUMN IF NOT EXISTS payment_scanner VARCHAR(1000)");
                jdbcTemplate.execute("UPDATE registrations SET status = 'PENDING' WHERE status IS NULL");
                
                // Alter existing column types to match the increased length limits
                jdbcTemplate.execute("ALTER TABLE events ALTER COLUMN payment_scanner TYPE TEXT");
                jdbcTemplate.execute("ALTER TABLE events ALTER COLUMN image TYPE TEXT");
                jdbcTemplate.execute("ALTER TABLE events ALTER COLUMN description TYPE TEXT");
                jdbcTemplate.execute("ALTER TABLE registrations ALTER COLUMN payment_screenshot TYPE TEXT");
                jdbcTemplate.execute("ALTER TABLE registrations ALTER COLUMN utr_number TYPE VARCHAR(1000)");
                
                System.out.println("Database schema updated successfully.");
            } catch (Exception e) {
                System.err.println("Database schema update failed: " + e.getMessage());
            }
        };
    }
}
