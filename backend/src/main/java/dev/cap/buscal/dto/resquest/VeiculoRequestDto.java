package dev.cap.buscal.dto.resquest;

import dev.cap.buscal.database.models.ENUM.StatusOnibus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VeiculoRequestDto(
        @Size(max = 4) String prefixo,
        @NotBlank @Size(max = 7) String placa,
        @NotNull StatusOnibus status
){}
