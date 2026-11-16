package dev.cap.buscal.mapper;

import dev.cap.buscal.database.models.RotaEntity;
import dev.cap.buscal.database.models.UsuarioEntity;
import dev.cap.buscal.database.models.VeiculoEntity;
import dev.cap.buscal.database.models.ViagemEntity;
import dev.cap.buscal.dto.response.ViagemResponseDto;
import dev.cap.buscal.dto.resquest.ViagemRequestDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ViagemMapper {

    private final UsuarioMapper usuarioMapper;

    private final VeiculoMapper veiculoMapper;

    private final RotaMapper rotaMapper;

    public ViagemResponseDto toDTO(ViagemEntity entity) {
        if (entity == null) return null;

        return new ViagemResponseDto(
                entity.getId(),
                entity.getDataHoraInicio(),
                entity.getDataHoraFinal(),
                entity.getStatus(),
                usuarioMapper.toDTO(entity.getMotorista()),
                veiculoMapper.toDTO(entity.getVeiculo()),
                rotaMapper.toDTO(entity.getRota())
        );
    }

    public ViagemEntity toEntity(ViagemRequestDto request,
                                 UsuarioEntity motorista,
                                 VeiculoEntity veiculo,
                                 RotaEntity rota) {
        if(request == null || motorista == null || veiculo == null || rota == null) return null;

        return ViagemEntity.builder()
                .motorista(motorista)
                .veiculo(veiculo)
                .rota(rota)
                .build();
    }

    public List<ViagemResponseDto> toListDTO(List<ViagemEntity> list){
        return list.stream()
                .map(i -> toDTO(i))
                .toList();
    }
}
