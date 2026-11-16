package dev.cap.buscal.service;

import dev.cap.buscal.database.models.IncidenteEntity;
import dev.cap.buscal.database.models.ViagemEntity;
import dev.cap.buscal.database.repository.IIncidenteRepository;
import dev.cap.buscal.dto.response.IncidenteResponseDto;
import dev.cap.buscal.dto.resquest.IncidenteRequestDto;
import dev.cap.buscal.exception.RecursoNaoEncontradoException;
import dev.cap.buscal.mapper.IncidenteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidenteService {

    private final IIncidenteRepository incidenteRepository;

    private final IncidenteMapper incidenteMapper;

    private final ViagemService viagemService;

    @Transactional
    public IncidenteResponseDto registrar(IncidenteRequestDto request){
        ViagemEntity viagem = viagemService.buscarEntityPorId(request.idViagem());

        IncidenteEntity incidente = incidenteMapper.toEntity(request,viagem);

        incidente.setDataHora(LocalDateTime.now());

        return incidenteMapper.toDTO(incidenteRepository.save(incidente));
    }

    @Transactional(readOnly = true)
    public List<IncidenteResponseDto> listarPorViagem(Long idViagem){
        List<IncidenteEntity> list = incidenteRepository.findAllByViagem_Id(idViagem);

        return incidenteMapper.toListDTO(list);
    }

    @Transactional(readOnly = true)
    protected IncidenteEntity buscarEntityPorId(Long id){
        return incidenteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Incidente não existe."));
    }
}