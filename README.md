# 抱团（Bunch Up）项目

## 项目概述
抱团是一个基于类别的在线聊天和工具分享平台，用户可以在不同类别中进行聊天交流，并使用各种工具。

## 核心功能

### 1. 用户认证系统
- 手机号注册登录
- 密码登录 / 验证码登录
- JWT Token认证

### 2. 分类管理系统
- 多个兴趣类别（短视频主播、炒股、财经、程序员、设计师等）
- 用户可选择进入不同类别
- 每个类别下有多个聊天分组

### 4. 工具管理系统
**重要：分类和工具的多对多关系**
- ✅ **实现完成**：工具通过`tool_scope`表与分类关联，实现真正的多对多关系
- ✅ **查询接口**：支持按分类ID查询相关工具，返回全局工具+分类专用工具
- ✅ **数据库设计**：`tool_scope`表管理工具展示范围，支持三种模式：
  - `ALL`: 全局工具，在所有分类中显示  
  - `CATEGORY`: 分类工具，只在指定分类中显示
  - `GROUP`: 分组工具，只在指定分组中显示
- ✅ **SQL查询优化**：使用LEFT JOIN一次查询获取所有相关工具
- ✅ **测试验证**：提供测试接口验证多对多关系查询正确性
- 工具类型：
  - `NORMAL`: 普通工具
  - `AGENT`: AI Agent工具

### 4. 聊天系统
- WebSocket实时聊天
- 分组聊天功能
- 消息持久化存储

## 技术架构

### 前端
- React Native Web
- Redux状态管理
- WebSocket客户端

### 后端
- Spring Boot 3.x
- MyBatis-Flex ORM
- WebSocket支持
- JWT认证

### 数据库
- MySQL 8.0
- 完整的表结构设计
- 支持多对多关系

## 核心实现细节

### 分类工具多对多关系实现 ✅

**数据库设计：**
```sql
-- 工具表：存储工具基本信息
CREATE TABLE tool (
    id BIGINT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    tool_type VARCHAR(20), -- NORMAL/AGENT
    url VARCHAR(255),
    is_default TINYINT,
    status TINYINT
);

-- 工具范围表：管理工具展示范围（多对多关系核心表）
CREATE TABLE tool_scope (
    id BIGINT PRIMARY KEY,
    tool_id BIGINT NOT NULL,        -- 工具ID
    scope_type VARCHAR(20) NOT NULL, -- ALL/CATEGORY/GROUP
    target_id BIGINT,               -- 目标ID（分类ID或分组ID）
);
```

**查询逻辑：**
```sql
-- 查询指定分类的工具（返回全局工具+分类专用工具）
SELECT DISTINCT t.* FROM tool t 
LEFT JOIN tool_scope ts ON t.id = ts.tool_id 
WHERE t.status = 1 AND (
    ts.scope_type = 'ALL' OR 
    (ts.scope_type = 'CATEGORY' AND ts.target_id = #{categoryId})
);
```

**API接口：**
- `GET /api/v1/tools?categoryId={id}` - 获取分类工具
- `GET /api/v1/tools/group?groupId={id}` - 获取分组工具
- `GET /api/v1/tools/test/category/{id}` - 测试分类工具关联

**实现特点：**
- ✅ 真正的多对多关系，支持一个工具属于多个分类
- ✅ 灵活的展示范围控制（全局/分类/分组）
- ✅ 高效的SQL查询，一次查询获取所有相关工具
- ✅ 良好的扩展性，可轻松添加新的范围类型

### 工具相关表
1. `tool` - 工具基本信息表
2. `tool_scope` - 工具展示范围关联表（核心多对多关系表）
3. `category` - 分类表
4. `chat_group` - 聊天分组表

### 用户相关表
1. `user` - 用户基本信息表
2. `user_tool` - 用户收藏工具关联表
3. `user_group` - 用户分组关联表

### 聊天相关表
1. `chat_message` - 聊天消息表
2. `verify_code` - 验证码表

## API接口

### 工具接口
- `GET /api/v1/tools?categoryId={id}` - 根据分类获取工具
- `GET /api/v1/tools/group?groupId={id}` - 根据分组获取工具

### 认证接口
- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册
- `POST /auth/sendVerifyCode` - 发送验证码

### 分类接口
- `GET /category/list` - 获取所有分类
- `GET /category/{id}` - 获取单个分类

## 开发环境

### 启动前端
```bash
cd bunch_up_app
npm start
```

### 启动后端
```bash
cd bunch_up_server
mvn spring-boot:run
```

### 数据库初始化
执行 `db/init.sql` 文件初始化数据库结构和测试数据。

## 重要说明

1. **工具与分类的关系**：工具和分类之间通过`tool_scope`表实现多对多关系，不是直接在tool表中存储category_id。

2. **展示逻辑**：查询某个分类的工具时，需要返回该分类专用的工具 + 全局工具。

3. **扩展性**：通过`tool_scope`表可以灵活扩展工具的展示范围，支持分类级别、分组级别、甚至用户级别的工具定制。