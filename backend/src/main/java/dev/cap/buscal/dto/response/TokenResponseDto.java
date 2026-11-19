package dev.cap.buscal.dto.response;

public record TokenResponseDto(
        String token,
        long expiresIn
) {}
