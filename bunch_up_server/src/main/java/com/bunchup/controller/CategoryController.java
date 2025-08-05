package com.bunchup.controller;

import com.bunchup.common.R;
import com.bunchup.dto.Category;
import com.bunchup.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 类别控制器
 * 
 * @author bunchup
 */
@Tag(name = "类别管理", description = "类别相关接口")
@RestController
@RequestMapping("/category")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @Operation(summary = "获取类别列表")
    @GetMapping("/list")
    public R<List<Category>> getCategoryList() {
        List<Category> categories = categoryService.find();
        return R.ok(categories);
    }
    
    @Operation(summary = "根据ID获取类别")
    @GetMapping("/{id}")
    public R<Category> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.get(id);
        return R.ok(category);
    }
    
    @Operation(summary = "初始化测试数据")
    @PostMapping("/init")
    public R<String> initTestData() {
        categoryService.initTestData();
        return R.ok("测试数据初始化成功");
    }
} 