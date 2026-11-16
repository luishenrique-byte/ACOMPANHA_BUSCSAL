package dev.cap.buscal.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ErrorResponse{
    private String mensagem;
    private Integer status;
    private List<CampoErro> listaErros;

    public ErrorResponse(String mensagem, Integer status) {
        this.mensagem = mensagem;
        this.status = status;
    }

    public record CampoErro(String campo, String erro) {}
}
