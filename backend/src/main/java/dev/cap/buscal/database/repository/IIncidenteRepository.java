package dev.cap.buscal.database.repository;

import dev.cap.buscal.database.models.IncidenteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IIncidenteRepository extends JpaRepository<IncidenteEntity, Long> {
    List<IncidenteEntity> findAllByViagem_Id(Long viagemId);
}
