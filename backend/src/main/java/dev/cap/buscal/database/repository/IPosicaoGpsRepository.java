package dev.cap.buscal.database.repository;

import dev.cap.buscal.database.models.PosicaoGpsEntity;
import dev.cap.buscal.database.models.ViagemEntity;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IPosicaoGpsRepository extends JpaRepository<PosicaoGpsEntity, Long> {
    List<PosicaoGpsEntity> findAllByViagem_Id(Long viagemId);

    Optional<PosicaoGpsEntity> findFirstByViagem_IdOrderByIdDesc(Long idViagem);
}
