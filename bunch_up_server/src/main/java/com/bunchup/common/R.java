package com.bunchup.common;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 统一响应结果
 * 
 * @author bunchup
 */
@Schema(description = "统一响应结果")
public class R<T> {
    
    @Schema(description = "响应码", example = "0")
    private Integer code;
    
    @Schema(description = "响应消息", example = "操作成功")
    private String message;
    
    @Schema(description = "响应数据")
    private T data;
    
    @Schema(description = "时间戳", example = "1640995200000")
    private Long timestamp;
    
    public R() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public R(Integer code, String message) {
        this();
        this.code = code;
        this.message = message;
    }
    
    public R(Integer code, String message, T data) {
        this(code, message);
        this.data = data;
    }
    
    // Getters and Setters
    public Integer getCode() {
        return code;
    }
    
    public void setCode(Integer code) {
        this.code = code;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
    
    public Long getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
    
    // Static factory methods
    public static <T> R<T> success() {
        return new R<>(0, "操作成功");
    }
    
    public static <T> R<T> success(String message) {
        return new R<>(0, message);
    }
    
    public static <T> R<T> success(T data) {
        return new R<>(0, "操作成功", data);
    }
    
    public static <T> R<T> success(String message, T data) {
        return new R<>(0, message, data);
    }
    
    public static <T> R<T> error(String message) {
        return new R<>(-1, message);
    }
    
    public static <T> R<T> error(Integer code, String message) {
        return new R<>(code, message);
    }
} 