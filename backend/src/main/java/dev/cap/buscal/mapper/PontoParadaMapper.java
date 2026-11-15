package dev.cap.buscal.mapper;

import dev.cap.buscal.database.models.PontoParadaEntity;
import dev.cap.buscal.database.models.RotaEntity;
import dev.cap.buscal.dto.response.PontoParadaResponseDto;
import dev.cap.buscal.dto.resquest.PontoParadaRequestDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PontoParadaMapper {

    public PontoParadaResponseDto toDTO(PontoParadaEntity entity){
        if (entity == null) return null;

        return new PontoParadaResponseDto(
                entity.getId(),
                entity.getNome(),
                entity.getLatitude(),
                entity.getLongitude(),
                entity.getOrdem(),
                entity.getRota() != null ? entity.getRota().getId() : null
        );
    }

    public PontoParadaEntity toEntity(PontoParadaRequestDto request,
                                      RotaEntity rota){
        if (request == null || rota == null) return null;

        return PontoParadaEntity.builder()
                .nome(request.nome())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .ordem(request.ordem())
                .rota(rota)
                .build();
    }

    public List<PontoParadaResponseDto> toListDTO(List<PontoParadaEntity> list){
        return list.stream()
                .map(i -> toDTO(i))
                .toList();
    }
}
