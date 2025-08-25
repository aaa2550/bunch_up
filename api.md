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

## 工具相关接口

### 1. 根据分类获取工具列表
**接口地址**: `GET /api/v1/tools`  
**请求方法**: GET  
**认证**: 不需要认证  

**查询参数**:
- categoryId: 分类ID（可选）

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "name": "视频编辑器",
      "description": "专业视频编辑工具",
      "icon": "/icons/video-editor.png",
      "toolType": "NORMAL",
      "url": "/tools/video-editor",
      "isDefault": true,
      "status": 1
    },
    {
      "id": 2,
      "name": "内容生成AI",
      "description": "AI内容创作助手",
      "icon": "/icons/ai-content.png",
      "toolType": "AGENT",
      "url": "/tools/ai-content",
      "isDefault": true,
      "status": 1
    },
    {
      "id": 7,
      "name": "通用计算器",
      "description": "多功能计算器工具",
      "icon": "/icons/calculator.png",
      "toolType": "NORMAL",
      "url": "/tools/calculator",
      "isDefault": true,
      "status": 1
    }
  ],
  "timestamp": 1640995200000
}
```

### 2. 根据分组获取工具列表
**接口地址**: `GET /api/v1/tools/group`  
**请求方法**: GET  
**认证**: 不需要认证  

**查询参数**:
- groupId: 分组ID（必需）

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": [
    {
      "id": 7,
      "name": "通用计算器",
      "description": "多功能计算器工具",
      "icon": "/icons/calculator.png",
      "toolType": "NORMAL",
      "url": "/tools/calculator",
      "isDefault": true,
      "status": 1
    }
  ],
  "timestamp": 1640995200000
}
```

**说明**:
- 工具与分类/分组的关系通过`tool_scope`表维护
- `scope_type`字段指定范围类型：
  - `ALL`: 全局工具，在所有分类和分组中都显示
  - `CATEGORY`: 指定分类工具，只在指定分类中显示
  - `GROUP`: 指定分组工具，只在指定分组中显示
- 查询时返回全局工具 + 指定范围内的工具

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