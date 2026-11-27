package dev.cap.buscal.mapper;

import dev.cap.buscal.database.models.VeiculoEntity;
import dev.cap.buscal.dto.response.VeiculoResponseDto;
import dev.cap.buscal.dto.resquest.VeiculoRequestDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VeiculoMapper {

    public VeiculoResponseDto toDTO(VeiculoEntity entity) {
        if (entity == null) return null;

        return new VeiculoResponseDto(entity.getId(),
                entity.getPrefixo(),
                entity.getPlaca(),
                entity.getStatus()
        );
    }

    public VeiculoEntity toEntity(VeiculoRequestDto request) {
        if (request == null) return null;

        return VeiculoEntity.builder()
                .prefixo(request.prefixo())
                .placa(request.placa())
                .status(request.status())
                .build();
    }

    public List<VeiculoResponseDto> toListDTO(List<VeiculoEntity> list){
        return list.stream()
                .map(i -> toDTO(i))
                .toList();
    }
}
