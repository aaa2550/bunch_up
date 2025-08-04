-- 抱团网站数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS bunch_up DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bunch_up;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
    `password` VARCHAR(255) NOT NULL COMMENT '密码',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
    `current_category_id` BIGINT DEFAULT NULL COMMENT '当前选择的类别ID',
    `status` TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_phone` (`phone`),
    KEY `idx_current_category` (`current_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 类别表
CREATE TABLE IF NOT EXISTS `category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '类别ID',
    `name` VARCHAR(50) NOT NULL COMMENT '类别名称',
    `description` VARCHAR(255) DEFAULT NULL COMMENT '类别描述',
    `icon` VARCHAR(255) DEFAULT NULL COMMENT '图标URL',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='类别表';

-- 分组表
CREATE TABLE IF NOT EXISTS `group` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '分组ID',
    `category_id` BIGINT NOT NULL COMMENT '所属类别ID',
    `name` VARCHAR(50) NOT NULL COMMENT '分组名称',
    `description` VARCHAR(255) DEFAULT NULL COMMENT '分组描述',
    `member_count` INT DEFAULT 0 COMMENT '成员数量',
    `max_members` INT DEFAULT 500 COMMENT '最大成员数',
    `status` TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分组表';

-- 用户分组关系表
CREATE TABLE IF NOT EXISTS `user_group` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '关系ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `group_id` BIGINT NOT NULL COMMENT '分组ID',
    `join_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_group` (`user_id`, `group_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户分组关系表';

-- 聊天消息表
CREATE TABLE IF NOT EXISTS `chat_message` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '消息ID',
    `group_id` BIGINT NOT NULL COMMENT '分组ID',
    `user_id` BIGINT NOT NULL COMMENT '发送用户ID',
    `content` TEXT NOT NULL COMMENT '消息内容',
    `message_type` VARCHAR(20) DEFAULT 'TEXT' COMMENT '消息类型：TEXT-文本，IMAGE-图片，VOICE-语音',
    `status` TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-删除',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
    PRIMARY KEY (`id`),
    KEY `idx_group_id` (`group_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天消息表';

-- 工具表
CREATE TABLE IF NOT EXISTS `tool` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '工具ID',
    `name` VARCHAR(50) NOT NULL COMMENT '工具名称',
    `description` VARCHAR(255) DEFAULT NULL COMMENT '工具描述',
    `icon` VARCHAR(255) DEFAULT NULL COMMENT '图标URL',
    `tool_type` VARCHAR(20) DEFAULT 'NORMAL' COMMENT '工具类型：NORMAL-普通工具，AGENT-AI工具',
    `url` VARCHAR(255) DEFAULT NULL COMMENT '工具URL',
    `is_default` TINYINT DEFAULT 0 COMMENT '是否默认工具：1-是，0-否',
    `status` TINYINT DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工具表';

-- 工具展示范围表
CREATE TABLE IF NOT EXISTS `tool_scope` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '范围ID',
    `tool_id` BIGINT NOT NULL COMMENT '工具ID',
    `scope_type` VARCHAR(20) NOT NULL COMMENT '范围类型：ALL-全部，CATEGORY-指定类别，GROUP-指定分组',
    `target_id` BIGINT DEFAULT NULL COMMENT '目标ID（类别ID或分组ID）',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_tool_id` (`tool_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工具展示范围表';

-- 用户工具关系表
CREATE TABLE IF NOT EXISTS `user_tool` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '关系ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `tool_id` BIGINT NOT NULL COMMENT '工具ID',
    `add_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_tool` (`user_id`, `tool_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_tool_id` (`tool_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户工具关系表';

-- 验证码表
CREATE TABLE IF NOT EXISTS `verify_code` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '验证码ID',
    `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
    `code` VARCHAR(10) NOT NULL COMMENT '验证码',
    `type` VARCHAR(20) DEFAULT 'REGISTER' COMMENT '类型：REGISTER-注册，LOGIN-登录',
    `expire_time` DATETIME NOT NULL COMMENT '过期时间',
    `used` TINYINT DEFAULT 0 COMMENT '是否已使用：1-已使用，0-未使用',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_phone` (`phone`),
    KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='验证码表';

-- 插入初始数据

-- 插入类别数据
INSERT INTO `category` (`id`, `name`, `description`, `icon`, `sort_order`) VALUES
(1, '短视频主播', '短视频主播交流群', '/icons/short-video.png', 1);

-- 插入分组数据
INSERT INTO `group` (`id`, `category_id`, `name`, `description`, `member_count`, `max_members`) VALUES
(1, 1, '新手主播群', '新手主播交流群', 0, 500),
(2, 1, '经验主播群', '经验主播交流群', 0, 300),
(3, 1, 'MCN机构群', 'MCN机构交流群', 0, 200);

-- 插入工具数据
INSERT INTO `tool` (`id`, `name`, `description`, `icon`, `tool_type`, `url`, `is_default`) VALUES
(1, 'AI助手', '智能AI助手，帮助解答问题', '/icons/ai-assistant.png', 'AGENT', '/tools/ai-assistant', 1),
(2, '数据分析', '数据分析工具', '/icons/data-analysis.png', 'NORMAL', '/tools/data-analysis', 1),
(3, '内容生成', 'AI内容生成工具', '/icons/content-generator.png', 'AGENT', '/tools/content-generator', 0);

-- 插入工具展示范围数据
INSERT INTO `tool_scope` (`tool_id`, `scope_type`, `target_id`) VALUES
(1, 'ALL', NULL),
(2, 'CATEGORY', 1),
(3, 'GROUP', 1); 