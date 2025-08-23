package com.bunchup.repository;

import com.bunchup.dto.Tool;
import java.util.List;

public interface ToolRepository {
    List<Tool> findByCategory(Long categoryId);
}
