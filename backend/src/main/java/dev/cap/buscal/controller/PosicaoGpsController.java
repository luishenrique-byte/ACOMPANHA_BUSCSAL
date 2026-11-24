package dev.cap.buscal.controller;

import dev.cap.buscal.dto.response.PosicaoGpsResponseDto;
import dev.cap.buscal.dto.resquest.PosicaoGpsRequestDto;
import dev.cap.buscal.service.PosicaoGpsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/posicaoGPS")
@RequiredArgsConstructor
public class PosicaoGpsController {

    private final PosicaoGpsService posicaoGpsService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PosicaoGpsResponseDto registrar(@Valid @RequestBody PosicaoGpsRequestDto request){
        return posicaoGpsService.registrarPosicao(request);
    }

    @GetMapping("/{idViagem}")
    @ResponseStatus(HttpStatus.OK)
    public List<PosicaoGpsResponseDto> listarHistoricoPorViagem(@PathVariable Long idViagem){
        return posicaoGpsService.listarHistoricoPorViagem(idViagem);
    }

    @GetMapping("/ultima/{idViagem}")
    @ResponseStatus(HttpStatus.OK)
    public PosicaoGpsResponseDto buscarUltimaDaViagem(@PathVariable Long idViagem){
        return posicaoGpsService.buscarUltimaPosicaoDaViagem(idViagem);
    }
}