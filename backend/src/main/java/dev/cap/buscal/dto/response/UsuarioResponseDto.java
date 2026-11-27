package dev.cap.buscal.dto.response;

public record UsuarioResponseDto(
        Long id,
        String nome,
        String email,
        String matricula,
        PerfilResponseDto perfil
) {}