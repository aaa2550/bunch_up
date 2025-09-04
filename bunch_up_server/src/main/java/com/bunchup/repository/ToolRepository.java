package com.bunchup.repository;

import com.bunchup.convert.ToolConverter;
import com.bunchup.dto.Tool;
import com.bunchup.entity.ToolDO;
import com.mybatisflex.core.service.IService;
import org.mapstruct.factory.Mappers;

import java.util.List;

public interface ToolRepository extends IService<ToolDO> {
    ToolConverter INSTANCE = Mappers.getMapper(ToolConverter.class);
    List<Tool> findByCategory(Long categoryId);
}
