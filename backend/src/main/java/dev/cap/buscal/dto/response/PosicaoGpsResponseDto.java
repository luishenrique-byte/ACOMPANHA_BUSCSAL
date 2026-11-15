package dev.cap.buscal.dto.response;

import java.time.LocalDateTime;

public record PosicaoGpsResponseDto (
    Long id,
    Double latitude,
    Double longitude,
    Double velocidade,
    Double precisao,
    LocalDateTime dataHora,
    Long idViagem
){}