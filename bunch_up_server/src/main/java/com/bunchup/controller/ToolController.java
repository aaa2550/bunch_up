package com.bunchup.controller;

import com.bunchup.common.R;
import com.bunchup.dto.Tool;
import com.bunchup.service.ToolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tools")
@Tag(name = "工具管理", description = "工具相关接口")
public class ToolController {
    
    @Autowired
    private ToolService toolService;
    
    @GetMapping
    @Operation(summary = "获取工具列表", description = "根据类别ID获取工具列表，不传categoryId则返回所有启用的工具")
    public R<List<Tool>> getTools(
        @Parameter(description = "类别ID") @RequestParam(required = false) Long categoryId
    ) {
        List<Tool> tools = toolService.getTools(categoryId);
        return R.ok(tools);
    }
    
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "根据分类获取工具列表", description = "根据分类ID获取可用的工具列表")
    public R<List<Tool>> getToolsByCategory(
        @Parameter(description = "分类ID") @PathVariable Long categoryId
    ) {
        List<Tool> tools = toolService.getTools(categoryId);
        return R.ok(tools);
    }
    
    @GetMapping("/group/{groupId}")
    @Operation(summary = "根据分组获取工具列表", description = "根据分组ID获取可用的工具列表")
    public R<List<Tool>> getToolsByGroup(
        @Parameter(description = "分组ID") @PathVariable Long groupId
    ) {
        List<Tool> tools = toolService.getToolsByGroup(groupId);
        return R.ok(tools);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "获取工具详情", description = "根据工具ID获取工具详细信息")
    public R<Tool> getToolDetail(
        @Parameter(description = "工具ID") @PathVariable Long id
    ) {
        Tool tool = toolService.getToolDetail(id);
        return R.ok(tool);
    }
}
