package dev.cap.buscal.controller;

import dev.cap.buscal.dto.response.ViagemResponseDto;
import dev.cap.buscal.dto.resquest.ViagemRequestDto;
import dev.cap.buscal.service.ViagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/viagem")
@RequiredArgsConstructor
public class ViagemController {

    private final ViagemService viagemService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ViagemResponseDto iniciar(@Valid @RequestBody ViagemRequestDto request){
        return viagemService.iniciarViagem(request);
    }

    @PatchMapping("/finalizar/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void finalizar(@PathVariable Long id){
        viagemService.finalizarViagem(id);
    }

    @PatchMapping("/pausar/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void pausar(@PathVariable Long id){
        viagemService.pausarViagem(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ViagemResponseDto buscarPorId(@PathVariable Long id){
        return viagemService.buscarPorId(id);
    }

    @GetMapping
    public List<ViagemResponseDto> listarAtivas(){
        return viagemService.listarAtivas();
    }
}