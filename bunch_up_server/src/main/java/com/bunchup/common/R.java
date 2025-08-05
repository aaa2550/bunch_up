package com.bunchup.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
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
    
    public static <T> R<T> ok(T data) {
        R<T> r = new R<>();
        r.setCode(0);
        r.setMessage("操作成功");
        r.setData(data);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }
    
    public static <T> R<T> error(String message) {
        R<T> r = new R<>();
        r.setCode(-1);
        r.setMessage(message);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }
    
    public static <T> R<T> success(String message, T data) {
        R<T> r = new R<>();
        r.setCode(0);
        r.setMessage(message);
        r.setData(data);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }
} 