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
    
    @Operation(summary = "获取所有启用的类别")
    @GetMapping("/list")
    public R<List<Category>> getCategoryList() {
        try {
            List<Category> categories = categoryService.getAllActive();
            return R.success(categories);
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }
    
    @Operation(summary = "根据ID获取类别")
    @GetMapping("/{id}")
    public R<Category> getCategoryById(@PathVariable Long id) {
        try {
            Category category = categoryService.getById(id);
            if (category != null) {
                return R.success(category);
            } else {
                return R.error("类别不存在");
            }
        } catch (Exception e) {
            return R.error(e.getMessage());
        }
    }
} 