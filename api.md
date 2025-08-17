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

## 类别相关接口

### 1. 获取所有启用的类别
**接口地址**: `GET /category/list`  
**请求方法**: GET  
**认证**: 不需要认证  

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "name": "短视频主播",
      "description": "短视频主播交流群",
      "status": 1,
      "createTime": "2024-01-01T12:00:00",
      "updateTime": "2024-01-01T12:00:00"
    },
    {
      "id": 2,
      "name": "炒股",
      "description": "股票投资交流群",
      "status": 1,
      "createTime": "2024-01-01T12:00:00",
      "updateTime": "2024-01-01T12:00:00"
    }
  ],
  "timestamp": 1640995200000
}
```

### 2. 根据ID获取类别
**接口地址**: `GET /category/{id}`  
**请求方法**: GET  
**认证**: 不需要认证  

**路径参数**:
- id: 类别ID

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "短视频主播",
    "description": "短视频主播交流群",
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

## 工具相关接口

### 1. 获取所有启用的工具列表
**接口地址**: `GET /api/v1/tools`  
**请求方法**: GET  
**认证**: 需要Token  

**请求参数**: 无  

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "name": "AI文本生成器",
      "description": "基于AI的文本生成工具",
      "toolType": "AI_AGENT",
      "url": "https://example.com/ai-text-generator",
      "isDefault": true,
      "status": 1,
      "createTime": "2024-01-01T12:00:00",
      "updateTime": "2024-01-01T12:00:00"
    }
  ],
  "timestamp": 1640995200000
}
```

### 2. 根据分类获取工具列表
**接口地址**: `GET /api/v1/tools/category/{categoryId}`  
**请求方法**: GET  
**认证**: 需要Token  

**路径参数**:
- `categoryId` (Long): 分类ID

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "name": "短视频文案生成器",
      "description": "专为短视频主播设计的文案生成工具",
      "toolType": "AI_AGENT",
      "url": "https://example.com/video-script-generator",
      "isDefault": true,
      "status": 1,
      "createTime": "2024-01-01T12:00:00",
      "updateTime": "2024-01-01T12:00:00"
    }
  ],
  "timestamp": 1640995200000
}
```

### 3. 根据分组获取工具列表
**接口地址**: `GET /api/v1/tools/group/{groupId}`  
**请求方法**: GET  
**认证**: 需要Token  

**路径参数**:
- `groupId` (Long): 分组ID

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": [
    {
      "id": 2,
      "name": "热门话题分析器",
      "description": "分析当前热门话题的工具",
      "toolType": "NORMAL",
      "url": "https://example.com/trend-analyzer",
      "isDefault": false,
      "status": 1,
      "createTime": "2024-01-01T12:00:00",
      "updateTime": "2024-01-01T12:00:00"
    }
  ],
  "timestamp": 1640995200000
}
```

### 4. 获取工具详情
**接口地址**: `GET /api/v1/tools/{id}`  
**请求方法**: GET  
**认证**: 需要Token  

**路径参数**:
- `id` (Long): 工具ID

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "AI文本生成器",
    "description": "基于AI的文本生成工具，支持多种文本类型生成",
    "toolType": "AI_AGENT",
    "url": "https://example.com/ai-text-generator",
    "isDefault": true,
    "status": 1,
    "createTime": "2024-01-01T12:00:00",
    "updateTime": "2024-01-01T12:00:00"
  },
  "timestamp": 1640995200000
}
```

## 测试接口

### 测试服务状态
**接口地址**: `GET /test`  
**请求方法**: GET  

**响应示例**:
```
抱团后端服务启动成功！
``` 