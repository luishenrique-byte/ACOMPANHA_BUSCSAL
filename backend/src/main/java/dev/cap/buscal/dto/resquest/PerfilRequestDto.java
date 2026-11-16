package dev.cap.buscal.dto.resquest;

import dev.cap.buscal.database.models.ENUM.UserPerfil;
import jakarta.validation.constraints.NotNull;

public record PerfilRequestDto(
        @NotNull UserPerfil perfil
){}
