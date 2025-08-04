package com.bunchup.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 测试控制器
 * 
 * @author bunchup
 */
@RestController
public class TestController {
    
    @GetMapping("/test")
    public String test() {
        return "抱团后端服务启动成功！";
    }
} 