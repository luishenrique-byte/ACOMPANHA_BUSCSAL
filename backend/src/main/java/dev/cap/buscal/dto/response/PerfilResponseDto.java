package dev.cap.buscal.dto.response;

import dev.cap.buscal.database.models.ENUM.UserPerfil;

public record PerfilResponseDto(
        Integer id,
        UserPerfil perfil
) {}