package dev.cap.buscal.dto.response;

import dev.cap.buscal.database.models.ENUM.TipoIncidente;

import java.time.LocalDateTime;

public record IncidenteResponseDto(
        Long id,
        TipoIncidente tipo,
        String descricao,
        LocalDateTime dataHora,
        Long idViagem
) {}