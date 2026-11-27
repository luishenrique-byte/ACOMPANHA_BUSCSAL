package dev.cap.buscal.database.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ponto_parada")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class PontoParadaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "ordem_rota")
    private Integer ordem;

    @ManyToOne
    @JoinColumn(name = "id_rota")
    private RotaEntity rota;
}
