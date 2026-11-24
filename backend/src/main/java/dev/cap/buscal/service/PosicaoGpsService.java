package dev.cap.buscal.service;

import dev.cap.buscal.database.models.PosicaoGpsEntity;
import dev.cap.buscal.database.models.ViagemEntity;
import dev.cap.buscal.database.repository.IPosicaoGpsRepository;
import dev.cap.buscal.dto.response.PosicaoGpsResponseDto;
import dev.cap.buscal.dto.resquest.PosicaoGpsRequestDto;
import dev.cap.buscal.exception.RecursoNaoEncontradoException;
import dev.cap.buscal.mapper.PosicaoGpsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PosicaoGpsService {

    private final IPosicaoGpsRepository posicaoGpsRepository;

    private final PosicaoGpsMapper posicaoGpsMapper;

    private final ViagemService viagemService;

    @Transactional
    public PosicaoGpsResponseDto registrarPosicao(PosicaoGpsRequestDto request){
        ViagemEntity viagem = viagemService.buscarEntityPorId(request.idViagem());

        PosicaoGpsEntity posicaoGps = posicaoGpsMapper.toEntity(request,viagem);

        posicaoGps.setDataHora(LocalDateTime.now());

        return posicaoGpsMapper.toDTO(posicaoGpsRepository.save(posicaoGps));
    }

    @Transactional(readOnly = true)
    public List<PosicaoGpsResponseDto> listarHistoricoPorViagem(Long idViagem){
        List<PosicaoGpsEntity> list = posicaoGpsRepository.findAllByViagem_Id(idViagem);
        return posicaoGpsMapper.toListDTO(list);
    }

    @Transactional(readOnly = true)
    public PosicaoGpsResponseDto buscarUltimaPosicaoDaViagem(Long idViagem){
         PosicaoGpsEntity ultimaPosicao = posicaoGpsRepository.findFirstByViagem_IdOrderByIdDesc(idViagem)
                 .orElseThrow(() -> new RecursoNaoEncontradoException("Nenhuma posição GPS registrada para essa viagem."));
         return posicaoGpsMapper.toDTO(ultimaPosicao);
    }

    @Transactional(readOnly = true)
    protected PosicaoGpsEntity buscarEntityPorId(Long id){
        return posicaoGpsRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Posicao não existe."));
    }
}