package dev.cap.buscal.database.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "posicao_gps")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PosicaoGpsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "velocidade")
    private Double velocidade;

    @Column(name = "precisao")
    private Double precisao;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "id_viagem")
    private ViagemEntity viagem;
}
