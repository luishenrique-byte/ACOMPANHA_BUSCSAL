package dev.cap.buscal.mapper;

import dev.cap.buscal.database.models.PosicaoGpsEntity;
import dev.cap.buscal.database.models.ViagemEntity;
import dev.cap.buscal.dto.response.PosicaoGpsResponseDto;
import dev.cap.buscal.dto.resquest.PosicaoGpsRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PosicaoGpsMapper {

    public PosicaoGpsResponseDto toDTO(PosicaoGpsEntity entity) {
        if (entity == null) return null;

        return new PosicaoGpsResponseDto(
                entity.getId(),
                entity.getLatitude(),
                entity.getLongitude(),
                entity.getVelocidade(),
                entity.getPrecisao(),
                entity.getDataHora(),
                entity.getViagem() != null ? entity.getViagem().getId() : null
        );
    }

    public PosicaoGpsEntity toEntity(PosicaoGpsRequestDto request,
                                     ViagemEntity viagem) {
        if (request == null || viagem == null) return null;

        return PosicaoGpsEntity.builder()
                .latitude(request.latitude())
                .longitude(request.longitude())
                .velocidade(request.velocidade())
                .precisao(request.precisao())
                .viagem(viagem)
                .build();
    }

    public List<PosicaoGpsResponseDto> toListDTO(List<PosicaoGpsEntity> list){
        return list.stream()
                .map(i -> toDTO(i))
                .toList();
    }
}
