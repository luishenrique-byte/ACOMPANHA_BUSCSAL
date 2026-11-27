package dev.cap.buscal.database.repository;

import dev.cap.buscal.database.models.ENUM.StatusViagem;
import dev.cap.buscal.database.models.ViagemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IViagemRepository extends JpaRepository<ViagemEntity, Long> {
    List<ViagemEntity> findAllByStatus(StatusViagem status);
}
