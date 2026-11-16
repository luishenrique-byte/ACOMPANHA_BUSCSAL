package dev.cap.buscal.database.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "rota")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RotaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "ativa")
    private Boolean ativa;

    @OneToMany(mappedBy = "rota")
    private List<PontoParadaEntity> pontosList;
}
