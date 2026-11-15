package dev.cap.buscal.database.models;

import dev.cap.buscal.database.models.ENUM.StatusOnibus;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "veiculo")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class VeiculoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prefixo")
    private String prefixo;

    @Column(name = "placa")
    private String placa;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusOnibus status;

    @OneToMany(mappedBy = "veiculo")
    private List<ViagemEntity> viagensList;
}
