package dev.cap.buscal.config;

import dev.cap.buscal.database.models.ENUM.UserPerfil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http
                .cors(Customizer.withDefaults())
                .csrf(c -> c.disable())
                .sessionManagement( s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                        .accessDeniedHandler((request, response, accessDeniedExecepion) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                        })
                )
                .authorizeHttpRequests( auth -> auth
                        // ==========================================
                        //  ROTAS PÚBLICAS
                        // ==========================================
                        .requestMatchers("/v1/auth/login").permitAll()
                        .requestMatchers(
                            "/swagger-ui/**",
                            "/swagger-ui.html/**" ,
                            "/v3/api-docs/**").permitAll()

                        // ==========================================
                        // ROTAS MOTORISTA
                        // ==========================================
                        .requestMatchers(HttpMethod.POST, "/v1/viagem", "/v1/incidente", "/v1/posicaoGPS").hasAuthority(UserPerfil.MOTORISTA.name())
                        .requestMatchers(HttpMethod.PATCH,"/v1/viagem/**").hasAuthority(UserPerfil.MOTORISTA.name())

                        // ==========================================
                        // ROTAS ADMIN
                        // ==========================================
                        .requestMatchers(HttpMethod.POST, "/v1/rota/**", "/v1/ponto-parada/**", "/v1/veiculo/**", "/v1/usuario").hasAuthority(UserPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/v1/veiculo/**", "/v1/rota/**", "/v1/usuario/**").hasAuthority(UserPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.PATCH, "/v1/veiculo/**").hasAuthority(UserPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/v1/ponto-parada/**").hasAuthority(UserPerfil.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/v1/usuario", "/v1/perfil/**").hasAuthority(UserPerfil.ADMIN.name())

                        // ==========================================
                        // ROTAS COMPARTILHADAS
                        // ==========================================
                        .requestMatchers(HttpMethod.GET,"/v1/rota/**", "/v1/ponto-parada/**", "/v1/viagem/**","/v1/posicaoGPS/**", "/v1/incidente/**", "/v1/veiculo/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration){
        return authenticationConfiguration.getAuthenticationManager();
    }
}
