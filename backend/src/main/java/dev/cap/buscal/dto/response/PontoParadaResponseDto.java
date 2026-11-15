package dev.cap.buscal.dto.response;

public record PontoParadaResponseDto(
         Long id,
         String nome,
         Double latitude,
         Double longitude,
         Integer ordem,
         Long idRota
) {}