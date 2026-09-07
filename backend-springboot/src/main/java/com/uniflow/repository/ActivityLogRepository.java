package com.uniflow.repository;

import com.uniflow.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findTop10ByOrderByTimestampDesc();
    List<ActivityLog> findAllByOrderByTimestampDesc();
    List<ActivityLog> findByUsernameOrderByTimestampDesc(String username);
}