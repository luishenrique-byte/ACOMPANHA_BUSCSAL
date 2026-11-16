package dev.cap.buscal.service;

import dev.cap.buscal.database.models.PontoParadaEntity;
import dev.cap.buscal.database.models.RotaEntity;
import dev.cap.buscal.database.repository.IPontoParadaRepository;
import dev.cap.buscal.dto.response.PontoParadaResponseDto;
import dev.cap.buscal.dto.resquest.PontoParadaRequestDto;
import dev.cap.buscal.exception.RecursoNaoEncontradoException;
import dev.cap.buscal.mapper.PontoParadaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PontoParadaService {

    private final IPontoParadaRepository pontoParadaRepository;

    private final PontoParadaMapper pontoParadaMapper;

    private final RotaService rotaService;

    @Transactional
    public PontoParadaResponseDto cadastrar(PontoParadaRequestDto request){

        RotaEntity rota = rotaService.buscarEntityPorId(request.idRota());

        PontoParadaEntity pontoParada = pontoParadaMapper.toEntity(request, rota);

        return pontoParadaMapper.toDTO(pontoParadaRepository.save(pontoParada));
    }

    @Transactional(readOnly = true)
    public List<PontoParadaResponseDto> listarPorRota(Long idRota){
        RotaEntity rota = rotaService.buscarEntityPorId(idRota);

        return pontoParadaMapper.toListDTO(pontoParadaRepository.findAllByRota(rota));
    }

    @Transactional
    public void remover(Long id){
        PontoParadaEntity entity = buscarEntityPorId(id);
        pontoParadaRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    protected PontoParadaEntity buscarEntityPorId(Long id){
        return pontoParadaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Ponto de Parada não existe."));
    }

}
