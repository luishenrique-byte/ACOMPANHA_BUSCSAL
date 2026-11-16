package dev.cap.buscal.controller;

import dev.cap.buscal.dto.response.RotaResponseDto;
import dev.cap.buscal.dto.resquest.RotaRequestDto;
import dev.cap.buscal.service.RotaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/rota")
@RequiredArgsConstructor
public class RotaController {

    private final RotaService rotaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RotaResponseDto cadastrar(@Valid @RequestBody RotaRequestDto request){
        return rotaService.cadastrar(request);
    }

    @PutMapping("/ativar/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void ativar(@PathVariable Long id){
        rotaService.ativar(id);
    }

    @PutMapping("/desativar/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desativar(@PathVariable Long id){
        rotaService.desativar(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RotaResponseDto buscarPorId(@PathVariable Long id){
        return rotaService.buscarPorId(id);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<RotaResponseDto> listarAtivas(){
        return rotaService.listarAtivas();
    }
}