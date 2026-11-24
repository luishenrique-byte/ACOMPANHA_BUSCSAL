package dev.cap.buscal.database.models;

import dev.cap.buscal.database.models.ENUM.StatusViagem;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "viagem")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ViagemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_hora_inicio")
    private LocalDateTime dataHoraInicio;

    @Column(name = "data_hora_final")
    private LocalDateTime dataHoraFinal;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusViagem status;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private UsuarioEntity motorista;

    @ManyToOne
    @JoinColumn(name = "id_veiculo")
    private VeiculoEntity veiculo;

    @ManyToOne
    @JoinColumn(name = "id_rota")
    private RotaEntity rota;

    @OneToMany(mappedBy = "viagem")
    private List<PosicaoGpsEntity> posicaoList;

    @OneToMany(mappedBy = "viagem")
    private List<IncidenteEntity> incidentesList;
}
