package dev.cap.buscal.controller;

import dev.cap.buscal.dto.response.PontoParadaResponseDto;
import dev.cap.buscal.dto.resquest.PontoParadaRequestDto;
import dev.cap.buscal.service.PontoParadaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/ponto-parada")
@RequiredArgsConstructor
public class PontoParadaController {

    private final PontoParadaService pontoParadaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PontoParadaResponseDto cadastrar(@Valid @RequestBody PontoParadaRequestDto request){
        return pontoParadaService.cadastrar(request);
    }

    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public List<PontoParadaResponseDto> listar(){
        return pontoParadaService.listar();
    }

    @GetMapping("/{idRota}")
    @ResponseStatus(HttpStatus.OK)
    public List<PontoParadaResponseDto> listarPorRota(@PathVariable Long idRota){
        return pontoParadaService.listarPorRota(idRota);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id){
        pontoParadaService.remover(id);
    }
}