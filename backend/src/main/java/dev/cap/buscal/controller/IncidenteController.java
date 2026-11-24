package dev.cap.buscal.controller;

import dev.cap.buscal.dto.response.IncidenteResponseDto;
import dev.cap.buscal.dto.resquest.IncidenteRequestDto;
import dev.cap.buscal.service.IncidenteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/incidente")
@RequiredArgsConstructor
public class IncidenteController {

    private final IncidenteService incidenteService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncidenteResponseDto registrar(@Valid @RequestBody IncidenteRequestDto request){
        return incidenteService.registrar(request);
    }

    @GetMapping("/porViagem/{idViagem}")
    @ResponseStatus(HttpStatus.OK)
    public List<IncidenteResponseDto> listarPorViagem(@PathVariable Long idViagem){
        return incidenteService.listarPorViagem(idViagem);
    }
}
