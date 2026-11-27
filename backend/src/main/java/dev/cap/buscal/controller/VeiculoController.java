package dev.cap.buscal.controller;

import dev.cap.buscal.database.models.ENUM.StatusOnibus;
import dev.cap.buscal.dto.response.VeiculoResponseDto;
import dev.cap.buscal.dto.resquest.VeiculoRequestDto;
import dev.cap.buscal.service.VeiculoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/veiculo")
@RequiredArgsConstructor
public class VeiculoController {

    private final VeiculoService veiculoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VeiculoResponseDto cadastrar(@Valid @RequestBody VeiculoRequestDto request){
        return veiculoService.cadastrar(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizar(@PathVariable Long id,
                          @Valid @RequestBody VeiculoRequestDto request){
        veiculoService.atualizar(id,request);
    }

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void alterarStatus(@PathVariable Long id,
                              @RequestParam StatusOnibus status){
        veiculoService.alterarStatus(id,status);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public VeiculoResponseDto buscarPorId(@PathVariable Long id){
        return veiculoService.buscarPorId(id);
    }
}