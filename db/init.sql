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

-- 聊天群组表
CREATE TABLE IF NOT EXISTS `chat_group` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '群组ID',
  `name` varchar(100) NOT NULL COMMENT '群组名称',
  `description` varchar(500) DEFAULT NULL COMMENT '群组描述',
  `avatar` varchar(255) DEFAULT NULL COMMENT '群组头像',
  `category_id` bigint NOT NULL COMMENT '类别ID',
  `member_count` INT DEFAULT 0 COMMENT '成员数量',
  `max_members` INT DEFAULT 500 COMMENT '最大成员数',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '群组状态：1-正常，0-禁用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='聊天群组表';

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
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `user_id` bigint NOT NULL COMMENT '发送者ID',
  `user_name` varchar(50) DEFAULT NULL COMMENT '发送者昵称',
  `group_id` bigint NOT NULL COMMENT '群组ID',
  `content` text NOT NULL COMMENT '消息内容',
  `message_type` tinyint NOT NULL DEFAULT '1' COMMENT '消息类型：1-文本，2-图片，3-文件',
  `send_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '消息状态：1-正常，0-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_group_id` (`group_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_send_time` (`send_time`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='聊天消息表';

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
(1, '短视频主播', '短视频主播交流群', '/icons/short-video.png', 1),
(2, '炒股', '股票投资交流群', '/icons/stock.png', 2),
(3, '财经', '财经资讯交流群', '/icons/finance.png', 3),
(4, '程序员', '程序员技术交流群', '/icons/programmer.png', 4),
(5, '设计师', '设计师创意交流群', '/icons/designer.png', 5)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), icon=VALUES(icon), sort_order=VALUES(sort_order);

-- 插入聊天群组数据
INSERT INTO `chat_group` (`id`, `name`, `description`, `avatar`, `category_id`, `status`, `member_count`) VALUES
(1, '短视频主播交流群', '分享短视频创作经验，讨论拍摄技巧和内容创作', '/icons/group-1.png', 1, 1, 5),
(2, '直播技巧分享群', '直播技巧和经验分享，提升直播效果', '/icons/group-2.png', 1, 1, 0),
(3, '股票投资交流群', '股票投资技术分析，市场趋势讨论', '/icons/group-3.png', 2, 1, 5),
(4, '基金投资讨论群', '基金投资经验分享，投资策略讨论', '/icons/group-4.png', 2, 1, 0),
(5, '财经资讯群', '财经新闻资讯分享，经济政策解读', '/icons/group-5.png', 3, 1, 5),
(6, '经济政策讨论群', '经济政策解读讨论，宏观经济分析', '/icons/group-6.png', 3, 1, 0),
(7, '程序员技术交流群', '技术问题讨论和分享，编程经验交流', '/icons/group-7.png', 4, 1, 5),
(8, '前端开发交流群', '前端技术交流，框架和工具分享', '/icons/group-8.png', 4, 1, 0),
(9, '设计师创意交流群', '设计创意分享，设计理念讨论', '/icons/group-9.png', 5, 1, 5),
(10, 'UI设计讨论群', 'UI设计经验分享，设计工具使用', '/icons/group-10.png', 5, 1, 0)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), avatar=VALUES(avatar), category_id=VALUES(category_id), status=VALUES(status), member_count=VALUES(member_count);

-- 插入测试用户数据
INSERT INTO `user` (`id`, `phone`, `password`, `nickname`, `avatar`, `current_category_id`, `status`) VALUES
(1, '13800138001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', '张三', '/avatars/user1.png', 1, 1),
(2, '13800138002', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', '李四', '/avatars/user2.png', 2, 1),
(3, '13800138003', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', '王五', '/avatars/user3.png', 3, 1),
(4, '13800138004', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', '赵六', '/avatars/user4.png', 4, 1),
(5, '13800138005', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', '钱七', '/avatars/user5.png', 5, 1)
ON DUPLICATE KEY UPDATE phone=VALUES(phone), password=VALUES(password), nickname=VALUES(nickname), avatar=VALUES(avatar), current_category_id=VALUES(current_category_id), status=VALUES(status);

-- 插入用户分组关系数据
INSERT INTO `user_group` (`user_id`, `group_id`) VALUES
(1, 1), (1, 3), (1, 5), (1, 7), (1, 9),
(2, 1), (2, 3), (2, 5), (2, 7), (2, 9),
(3, 1), (3, 3), (3, 5), (3, 7), (3, 9),
(4, 1), (4, 3), (4, 5), (4, 7), (4, 9),
(5, 1), (5, 3), (5, 5), (5, 7), (5, 9)
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id), group_id=VALUES(group_id);

-- 插入测试聊天消息数据
INSERT INTO `chat_message` (`user_id`, `user_name`, `group_id`, `content`, `message_type`, `send_time`, `status`) VALUES
-- 短视频主播交流群消息
(1, '张三', 1, '大家好，欢迎来到短视频主播交流群！', 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 1),
(2, '李四', 1, '今天天气不错，适合拍摄外景', 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), 1),
(3, '王五', 1, '有什么新消息吗？', 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 1),
(1, '张三', 1, '分享一个有趣的内容', 1, DATE_SUB(NOW(), INTERVAL 15 MINUTE), 1),
(2, '李四', 1, '大家有什么想法？', 1, DATE_SUB(NOW(), INTERVAL 5 MINUTE), 1),

-- 股票投资交流群消息
(2, '李四', 3, '大家好，欢迎来到股票投资交流群！', 1, DATE_SUB(NOW(), INTERVAL 3 HOUR), 1),
(3, '王五', 3, '今天股市怎么样？', 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 1),
(4, '赵六', 3, '有什么投资建议吗？', 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), 1),
(2, '李四', 3, '分享一些投资经验', 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 1),
(3, '王五', 3, '市场分析很重要', 1, DATE_SUB(NOW(), INTERVAL 10 MINUTE), 1),

-- 程序员技术交流群消息
(4, '赵六', 7, '大家好，欢迎来到程序员技术交流群！', 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), 1),
(5, '钱七', 7, '今天遇到一个技术问题', 1, DATE_SUB(NOW(), INTERVAL 3 HOUR), 1),
(1, '张三', 7, '有什么技术分享吗？', 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 1),
(4, '赵六', 7, '分享一些编程经验', 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), 1),
(5, '钱七', 7, '代码质量很重要', 1, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 1)
ON DUPLICATE KEY UPDATE user_name=VALUES(user_name), content=VALUES(content), send_time=VALUES(send_time), status=VALUES(status);

-- 插入工具数据
INSERT INTO `tool` (`id`, `name`, `description`, `icon`, `tool_type`, `url`, `is_default`, `status`) VALUES
(1, '视频编辑器', '专业视频编辑工具', '/icons/video-editor.png', 'NORMAL', '/tools/video-editor', 1, 1),
(2, '内容生成AI', 'AI内容创作助手', '/icons/ai-content.png', 'AGENT', '/tools/ai-content', 1, 1),
(3, '股票分析工具', '实时股票分析平台', '/icons/stock-analyzer.png', 'NORMAL', '/tools/stock-analyzer', 0, 1),
(4, '投资顾问AI', 'AI投资建议助手', '/icons/ai-advisor.png', 'AGENT', '/tools/ai-advisor', 0, 1),
(5, '代码生成器', '智能代码生成工具', '/icons/code-generator.png', 'AGENT', '/tools/code-generator', 0, 1),
(6, '设计助手', 'AI设计创意工具', '/icons/design-assistant.png', 'AGENT', '/tools/design-assistant', 0, 1),
(7, '通用计算器', '多功能计算器工具', '/icons/calculator.png', 'NORMAL', '/tools/calculator', 1, 1),
(8, '财经新闻爬虫', '实时财经新闻抓取工具', '/icons/news-crawler.png', 'NORMAL', '/tools/news-crawler', 0, 1),
(9, '经济指标分析', 'AI经济指标分析助手', '/icons/economic-analysis.png', 'AGENT', '/tools/economic-analysis', 0, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), icon=VALUES(icon), tool_type=VALUES(tool_type), url=VALUES(url), is_default=VALUES(is_default), status=VALUES(status);

-- 插入工具展示范围数据
INSERT INTO `tool_scope` (`tool_id`, `scope_type`, `target_id`) VALUES
-- 全局工具
(7, 'ALL', NULL),
-- 短视频主播类别工具
(1, 'CATEGORY', 1),
(2, 'CATEGORY', 1),
-- 炒股类别工具
(3, 'CATEGORY', 2),
(4, 'CATEGORY', 2),
-- 财经类别工具
(8, 'CATEGORY', 3),
(9, 'CATEGORY', 3),
-- 程序员类别工具
(5, 'CATEGORY', 4),
-- 设计师类别工具
(6, 'CATEGORY', 5)
ON DUPLICATE KEY UPDATE tool_id=VALUES(tool_id), scope_type=VALUES(scope_type), target_id=VALUES(target_id);

-- 其他插入语句...

-- 初始化完成提示
SELECT '数据库初始化完成！' AS message;

-- ========================================
-- 2024-08-23 更新: 修复分类和工具多对多关系
-- ========================================

-- 更新工具数据，确保数据符合预期
UPDATE `tool` SET 
    `name` = '视频编辑器',
    `description` = '专业视频编辑工具',
    `tool_type` = 'NORMAL',
    `url` = '/tools/video-editor',
    `is_default` = 1
WHERE `id` = 1;

UPDATE `tool` SET 
    `name` = '内容生成AI',
    `description` = 'AI内容创作助手', 
    `tool_type` = 'AGENT',
    `url` = '/tools/ai-content',
    `is_default` = 1
WHERE `id` = 2;

UPDATE `tool` SET 
    `name` = '股票分析工具',
    `description` = '实时股票分析平台',
    `tool_type` = 'NORMAL', 
    `url` = '/tools/stock-analyzer',
    `is_default` = 0
WHERE `id` = 3;

-- 如果还有其他工具ID，继续更新
INSERT INTO `tool` (`id`, `name`, `description`, `icon`, `tool_type`, `url`, `is_default`, `status`) VALUES
(4, '投资顾问AI', 'AI投资建议助手', '/icons/ai-advisor.png', 'AGENT', '/tools/ai-advisor', 0, 1),
(5, '代码生成器', '智能代码生成工具', '/icons/code-generator.png', 'AGENT', '/tools/code-generator', 0, 1),
(6, '设计助手', 'AI设计创意工具', '/icons/design-assistant.png', 'AGENT', '/tools/design-assistant', 0, 1),
(7, '通用计算器', '多功能计算器工具', '/icons/calculator.png', 'NORMAL', '/tools/calculator', 1, 1),
(8, '财经新闻爬虫', '实时财经新闻抓取工具', '/icons/news-crawler.png', 'NORMAL', '/tools/news-crawler', 0, 1),
(9, '经济指标分析', 'AI经济指标分析助手', '/icons/economic-analysis.png', 'AGENT', '/tools/economic-analysis', 0, 1)
ON DUPLICATE KEY UPDATE 
    name=VALUES(name), 
    description=VALUES(description), 
    icon=VALUES(icon), 
    tool_type=VALUES(tool_type), 
    url=VALUES(url), 
    is_default=VALUES(is_default), 
    status=VALUES(status);

-- 清理可能错误的tool_scope数据
DELETE FROM `tool_scope` WHERE `tool_id` NOT IN (1,2,3,4,5,6,7,8,9);

-- 重新插入正确的tool_scope关联数据
INSERT INTO `tool_scope` (`tool_id`, `scope_type`, `target_id`) VALUES
-- 全局工具
(7, 'ALL', NULL),
-- 短视频主播类别工具 (分类ID=1)
(1, 'CATEGORY', 1),
(2, 'CATEGORY', 1), 
-- 炒股类别工具 (分类ID=2)
(3, 'CATEGORY', 2),
(4, 'CATEGORY', 2),
-- 财经类别工具 (分类ID=3) 
(8, 'CATEGORY', 3),
(9, 'CATEGORY', 3),
-- 程序员类别工具 (分类ID=4)
(5, 'CATEGORY', 4),
-- 设计师类别工具 (分类ID=5)
(6, 'CATEGORY', 5)
ON DUPLICATE KEY UPDATE tool_id=VALUES(tool_id), scope_type=VALUES(scope_type), target_id=VALUES(target_id);

-- 验证多对多关系查询
-- 查询短视频主播类别(ID=1)的工具：应该返回工具1,2,7
-- SELECT DISTINCT t.* FROM tool t LEFT JOIN tool_scope ts ON t.id = ts.tool_id WHERE t.status = 1 AND (ts.scope_type = 'ALL' OR (ts.scope_type = 'CATEGORY' AND ts.target_id = 1));

-- 查询炒股类别(ID=2)的工具：应该返回工具3,4,7  
-- SELECT DISTINCT t.* FROM tool t LEFT JOIN tool_scope ts ON t.id = ts.tool_id WHERE t.status = 1 AND (ts.scope_type = 'ALL' OR (ts.scope_type = 'CATEGORY' AND ts.target_id = 2));

-- 查询财经类别(ID=3)的工具：应该返回工具7,8,9
-- SELECT DISTINCT t.* FROM tool t LEFT JOIN tool_scope ts ON t.id = ts.tool_id WHERE t.status = 1 AND (ts.scope_type = 'ALL' OR (ts.scope_type = 'CATEGORY' AND ts.target_id = 3));

-- ========================================
-- 2024-08-25 更新: 添加游戏功能相关表
-- ========================================

-- 游戏房间表
CREATE TABLE IF NOT EXISTS `game_room` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '房间自增ID',
    `room_id` VARCHAR(100) NOT NULL COMMENT '房间ID（通常是groupId_gameType格式）',
    `game_type` VARCHAR(50) NOT NULL COMMENT '游戏类型：snake, tetris等',
    `group_id` BIGINT NOT NULL COMMENT '所属聊天分组ID',
    `game_state` TEXT DEFAULT NULL COMMENT '游戏状态JSON',
    `status` VARCHAR(20) DEFAULT 'waiting' COMMENT '房间状态：waiting, playing, ended',
    `max_players` INT DEFAULT 10 COMMENT '最大玩家数',
    `current_players` INT DEFAULT 0 COMMENT '当前玩家数',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_room_id` (`room_id`),
    KEY `idx_game_type` (`game_type`),
    KEY `idx_group_id` (`group_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游戏房间表';

-- 游戏玩家表
CREATE TABLE IF NOT EXISTS `game_player` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '玩家记录ID',
    `room_id` VARCHAR(100) NOT NULL COMMENT '游戏房间ID',
    `user_id` BIGINT NOT NULL COMMENT '玩家用户ID',
    `player_name` VARCHAR(50) NOT NULL COMMENT '玩家昵称',
    `score` INT DEFAULT 0 COMMENT '当前得分',
    `player_state` TEXT DEFAULT NULL COMMENT '玩家状态JSON（如蛇的位置等）',
    `status` VARCHAR(20) DEFAULT 'playing' COMMENT '玩家状态：playing, game_over, disconnected',
    `join_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_room_user` (`room_id`, `user_id`),
    KEY `idx_room_id` (`room_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游戏玩家表';
