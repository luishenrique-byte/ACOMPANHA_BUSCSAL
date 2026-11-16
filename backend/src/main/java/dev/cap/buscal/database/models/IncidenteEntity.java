package dev.cap.buscal.database.models;

import dev.cap.buscal.database.models.ENUM.TipoIncidente;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidente")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class IncidenteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoIncidente tipo;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "id_viagem")
    private ViagemEntity viagem;
}
