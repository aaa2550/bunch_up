package com.bunchup.service;

import com.bunchup.dto.Tool;

import java.util.List;

public interface ToolService {
    List<Tool> findByCategory(Long categoryId);
}
