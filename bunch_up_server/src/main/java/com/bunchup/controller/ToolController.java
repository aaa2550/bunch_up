package com.bunchup.controller;

import com.bunchup.common.R;
import com.bunchup.dto.Tool;
import com.bunchup.service.ToolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "工具管理", description = "AI工具相关接口")
@RestController
@RequestMapping("/api/v1/tools")
public class ToolController {

    @Autowired
    private ToolService toolService;

    @Operation(summary = "根据分类获取工具（返回全局通用 + 指定分类工具）")
    @GetMapping
    public R<List<Tool>> getTools(@RequestParam(required = false) Long categoryId) {
        List<Tool> tools = toolService.findByCategory(categoryId);
        return R.ok(tools);
    }
}
