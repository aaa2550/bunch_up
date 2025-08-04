# 抱团平台 API 文档

## 基础信息
- 基础URL: `http://localhost:8080`
- 认证方式: JWT Token
- 响应格式: JSON

## 统一响应格式
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {},
  "timestamp": 1640995200000
}
```

## 认证相关接口

### 1. 用户注册
**接口地址**: `POST /auth/register`  
**请求方法**: POST  
**Content-Type**: application/json  

**请求参数**:
```json
{
  "phone": "13800138000",
  "password": "123456",
  "verifyCode": "123456"
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "id": 1,
    "phone": "13800138000",
    "nickname": "用户8000",
    "avatar": null,
    "status": 1,
    "createTime": "2024-01-01T12:00:00",
    "updateTime": "2024-01-01T12:00:00"
  },
  "timestamp": 1640995200000
}
```

### 2. 密码登录
**接口地址**: `POST /auth/login`  
**请求方法**: POST  
**Content-Type**: application/json  

**请求参数**:
```json
{
  "phone": "13800138000",
  "password": "123456"
}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "phone": "13800138000",
      "nickname": "用户8000",
      "avatar": null,
      "status": 1,
      "createTime": "2024-01-01T12:00:00",
      "updateTime": "2024-01-01T12:00:00"
    },
    "token": "token_1_1640995200000"
  },
  "timestamp": 1640995200000
}
```

### 3. 验证码登录
**接口地址**: `POST /auth/login/code`  
**请求方法**: POST  
**Content-Type**: application/x-www-form-urlencoded  

**请求参数**:
- phone: 手机号
- verifyCode: 验证码

**响应示例**:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "phone": "13800138000",
      "nickname": "用户8000",
      "avatar": null,
      "status": 1,
      "createTime": "2024-01-01T12:00:00",
      "updateTime": "2024-01-01T12:00:00"
    },
    "token": "token_1_1640995200000"
  },
  "timestamp": 1640995200000
}
```

### 4. 发送验证码
**接口地址**: `POST /auth/sendVerifyCode`  
**请求方法**: POST  
**Content-Type**: application/x-www-form-urlencoded  

**请求参数**:
- phone: 手机号
- type: 验证码类型（register-注册，login-登录）

**响应示例**:
```json
{
  "code": 0,
  "message": "验证码发送成功",
  "data": null,
  "timestamp": 1640995200000
}
```

### 5. 获取用户信息
**接口地址**: `GET /auth/user/{id}`  
**请求方法**: GET  
**认证**: 需要JWT Token  

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 1,
    "phone": "13800138000",
    "nickname": "用户8000",
    "avatar": null,
    "status": 1,
    "createTime": "2024-01-01T12:00:00",
    "updateTime": "2024-01-01T12:00:00"
  },
  "timestamp": 1640995200000
}
```

## 错误码说明
- 0: 成功
- -1: 失败（通用错误）
- 其他: 具体业务错误码

## 测试接口

### 测试服务状态
**接口地址**: `GET /test`  
**请求方法**: GET  

**响应示例**:
```
抱团后端服务启动成功！
``` 