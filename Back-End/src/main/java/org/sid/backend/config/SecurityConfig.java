package org.sid.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Désactiver CSRF (pour un environnement sécurisé, réactivez-le avec une configuration adaptée)
                .csrf(csrf -> csrf.disable())

                // Désactiver la gestion des sessions (stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configurer les autorisations pour les endpoints
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/signup","/signup", "/login","/swagger-ui/**", "/v3/api-docs/**", "/api/users/login").permitAll() // Endpoints publics
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Endpoints ADMIN protégés
                        .requestMatchers("/api/user/**").hasRole("USER")  // Endpoints USER protégés
                        .anyRequest().authenticated() // Tous les autres endpoints nécessitent une authentification
                )

                // Configurer OAuth2 Resource Server pour JWT
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

    // Bean pour le cryptage des mots de passe
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
