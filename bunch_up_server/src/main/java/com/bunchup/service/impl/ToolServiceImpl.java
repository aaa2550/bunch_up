package com.bunchup.service.impl;

import com.bunchup.dto.Tool;
import com.bunchup.repository.ToolRepository;
import com.bunchup.service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ToolServiceImpl implements ToolService {
    @Autowired
    private ToolRepository toolRepository;

    @Override
    public List<Tool> findByCategory(Long categoryId) {
        return toolRepository.findByCategory(categoryId);
    }
}
