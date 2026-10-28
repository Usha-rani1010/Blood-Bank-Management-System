package com.usharani.blood_bank_management.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.usharani.blood_bank_management.model.User;
import com.usharani.blood_bank_management.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.superadmin.name:Super Administrator}")
    private String superAdminName;

    @Value("${app.superadmin.email:superadmin@bloodbank.org}")
    private String superAdminEmail;

    @Value("${app.superadmin.password:SuperAdmin@2026!}")
    private String superAdminPassword;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Secure bootstrap: Provision initial Super Admin if none exists
        if (!userRepository.existsByRole("SUPER_ADMIN")) {
            if (!userRepository.existsByEmail(superAdminEmail)) {
                User superAdmin = new User();
                superAdmin.setName(superAdminName);
                superAdmin.setEmail(superAdminEmail);
                superAdmin.setPassword(passwordEncoder.encode(superAdminPassword));
                superAdmin.setRole("SUPER_ADMIN");

                userRepository.save(superAdmin);
                logger.info("=========================================================");
                logger.info("BOOTSTRAP: Initial Super Admin provisioned successfully!");
                logger.info("Email: {}", superAdminEmail);
                logger.info("Role: SUPER_ADMIN");
                logger.info("=========================================================");
            } else {
                // If user with email exists but is not SUPER_ADMIN, upgrade role
                User existing = userRepository.findByEmail(superAdminEmail).orElse(null);
                if (existing != null) {
                    existing.setRole("SUPER_ADMIN");
                    userRepository.save(existing);
                    logger.info("BOOTSTRAP: Elevated existing user {} to SUPER_ADMIN.", superAdminEmail);
                }
            }
        }
    }
}
