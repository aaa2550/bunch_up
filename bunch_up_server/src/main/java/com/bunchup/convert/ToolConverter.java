package com.bunchup.convert;

import com.bunchup.dto.Tool;
import com.bunchup.entity.ToolDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface ToolConverter {

    ToolConverter INSTANCE = Mappers.getMapper(ToolConverter.class);

    Tool convertToDTO(ToolDO obj);

    List<Tool> convertToDTO(List<ToolDO> list);

    Page<Tool> convertToDTO(Page<ToolDO> page);

    ToolDO convertToDO(Tool obj);

    List<ToolDO> convertToDO(List<Tool> list);

} 