package dev.cap.buscal.dto.response;

import dev.cap.buscal.database.models.ENUM.StatusOnibus;

public record VeiculoResponseDto(
        Long id,
        String prefixo,
        String placa,
        StatusOnibus status
) {}