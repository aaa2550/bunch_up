-- 工具表
CREATE TABLE tools (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '工具名称',
    description VARCHAR(200) COMMENT '工具描述',
    icon VARCHAR(100) COMMENT '工具图标',
    category_id BIGINT COMMENT '专属类别ID，为空表示通用工具',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 工具表单字段表
CREATE TABLE tool_form_fields (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tool_id BIGINT NOT NULL COMMENT '工具ID',
    field_name VARCHAR(50) NOT NULL COMMENT '字段名称',
    field_type ENUM('input', 'textarea', 'radio') NOT NULL COMMENT '字段类型',
    field_label VARCHAR(50) NOT NULL COMMENT '字段标签',
    placeholder VARCHAR(100) COMMENT '占位文本',
    max_length INT COMMENT '最大长度',
    required BOOLEAN DEFAULT false COMMENT '是否必填',
    sort_order INT DEFAULT 0 COMMENT '排序',
    options JSON COMMENT 'radio类型的选项，JSON数组格式',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES tools(id)
);

-- 示例数据
INSERT INTO tools (name, description, icon, category_id) VALUES
('文案生成', '基于AI的文案生成工具', 'edit', NULL),
('图片优化', '智能图片优化和处理', 'image', NULL),
('直播标题生成', '生成吸引人的直播标题', 'title', 1),  -- 假设1是直播类别
('产品描述优化', '优化产品介绍文案', 'description', 2); -- 假设2是电商类别

INSERT INTO tool_form_fields (tool_id, field_name, field_type, field_label, placeholder, max_length, required, sort_order, options) VALUES
(1, 'prompt', 'input', '关键词', '请输入关键词', 200, true, 1, NULL),
(1, 'tone', 'radio', '文案风格', NULL, NULL, true, 2, '[{"label": "正式", "value": "formal"}, {"label": "轻松", "value": "casual"}, {"label": "幽默", "value": "humorous"}]'),
(1, 'description', 'textarea', '补充说明', '请输入更详细的要求说明', 1000, false, 3, NULL),
(2, 'imageUrl', 'input', '图片链接', '请输入图片URL', 200, true, 1, NULL),
(2, 'style', 'radio', '优化风格', NULL, NULL, true, 2, '[{"label": "清晰", "value": "sharp"}, {"label": "柔和", "value": "soft"}]');
