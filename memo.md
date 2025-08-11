# 抱团项目开发备忘录

## 2024-08-04 开发记录

### 前端依赖问题修复
- **问题**: `Uncaught TypeError: StyleSheet.create is not a function`
- **原因**: ajv模块版本不兼容
- **解决**: 安装正确版本的ajv模块 (`ajv@^8.0.0`)
- **命令**: `npm install ajv@^8.0.0 --save-dev --legacy-peer-deps`

### 前端服务启动
- **状态**: ✅ 前端服务正常运行在 http://localhost:3000
- **状态**: ✅ 后端服务正常运行在 http://localhost:8080

### 登录功能实现
- **功能**: 用户注册登录，支持手机号密码、验证码登录
- **接口**: 调用真实后端接口 `http://localhost:8080/auth/login`
- **状态**: ✅ 登录功能正常工作

### 注册功能实现
- **功能**: 用户注册，支持手机号注册
- **接口**: 调用真实后端接口 `http://localhost:8080/auth/register`
- **状态**: ✅ 注册功能正常工作

### 验证码功能实现
- **功能**: 发送验证码
- **接口**: 调用真实后端接口 `http://localhost:8080/auth/sendVerifyCode`
- **状态**: ✅ 验证码功能正常工作

### 登录流程优化
- **流程**: 登录成功 → 类别选择页面 → 聊天页面
- **实现**: 
  - 登录成功后跳转到类别选择页面
  - 类别选择页面显示所有可用类别
  - 选择类别后进入对应的聊天页面
- **状态**: ✅ 完整流程正常工作

### 类别页面重新设计 (2024-08-04 更新)
- **问题**: 用户反馈类别选择页面设计过于复杂，不符合扁平化风格
- **改进**:
  - 简化页面布局，减少不必要的装饰元素
  - 调整字体大小和间距，使页面更简洁
  - 优化数据获取逻辑，支持从服务端获取真实数据
  - 如果服务端数据获取失败，自动使用默认模拟数据
  - 移除复杂的统计信息显示，只保留类别名称和描述
- **设计原则**: 严格遵循扁平化设计，简洁大方
- **状态**: ✅ 重新设计完成

### 聊天页面重新设计 (2024-08-04 更新)
- **问题**: 用户反馈聊天页面需要左右布局，左边分组列表，右边聊天窗口
- **改进**:
  - 采用左右布局设计，左侧280px宽度显示分组列表
  - 右侧显示聊天窗口，包含消息列表和输入框
  - 分组列表支持选择切换，当前选中分组高亮显示
  - 聊天窗口显示当前分组名称和成员数
  - 消息气泡采用扁平化设计，区分自己和他人消息
  - 输入框支持多行输入，发送按钮状态联动
- **设计特点**:
  - 扁平化设计风格，简洁大气
  - 合理的布局比例，适合Web页面
  - 清晰的信息层次，易于使用
  - 响应式交互，用户体验良好
- **状态**: ✅ 重新设计完成

### ChatScreen参数传递错误修复 (2024-08-04 更新)
- **问题**: `TypeError: Cannot read properties of undefined (reading 'params')`
- **原因**: SimpleNavigator中ChatScreen的参数传递方式不正确
- **修复**: 将`category`属性改为`route={{params: {category: currentCategory}}}`传递
- **状态**: ✅ 错误修复完成

### ChatScreen renderMessage函数调用错误修复 (2024-08-04 更新)
- **问题**: `TypeError: Cannot read properties of undefined (reading 'userId')`
- **原因**: `messages.map(renderMessage)`直接调用renderMessage函数，但函数期望接收`{item}`对象
- **修复**: 改为`messages.map((item, index) => renderMessage({item}))`正确传递参数
- **状态**: ✅ 错误修复完成

### 页面布局优化 (2024-08-04 更新)
- **类别选择页面优化**:
  - 改为居中显示，不占全屏
  - 设置固定宽度480px，最大宽度90%
  - 添加白色卡片背景和轻微阴影
  - 限制类别列表最大高度400px
  - 优化间距和布局，更加简洁
- **聊天页面高度修复**:
  - 设置容器高度为`100vh`确保占满屏幕
  - 主内容区域高度为`calc(100vh - 64px)`
  - 聊天区域使用flex布局确保正确分布
  - 确保消息列表和输入框正确显示
- **状态**: ✅ 布局优化完成

### 弹窗组件和聊天页面重新设计 (2024-08-04 更新)
- **扁平化弹窗组件**:
  - 创建了完整的Modal组件，支持多种类型（success、warning、error、info）
  - 支持不同尺寸（small、medium、large）
  - 包含类型图标、关闭按钮、确认取消按钮
  - 扁平化设计风格，圆角16px，阴影效果
  - 支持点击遮罩关闭，滚动内容区域
- **聊天页面布局重新设计**:
  - 保留左侧分组列表（280px宽度）
  - 中间为聊天区域，包含消息列表和输入框
  - 右侧添加程序坞样式的菜单（60px宽度）
  - 程序坞包含工具、设置、我的、消息、搜索等功能入口
  - 扁平化设计，层次感强
- **状态**: ✅ 重新设计完成

### Toast提示组件和聊天页面优化 (2024-08-04 更新)
- **扁平化Toast组件**:
  - 创建了Toast组件，支持多种类型（success、error、warning、info）
  - 自动显示和隐藏，无需用户点击确认
  - 动画效果：淡入淡出和滑动
  - 扁平化设计风格，圆角8px，阴影效果
  - 支持自定义显示时长
- **登录页面优化**:
  - 使用Toast组件替代alert弹窗
  - 登录成功后显示成功提示，1.5秒后自动跳转
  - 错误提示更加友好
  - 扁平化设计风格统一
- **聊天页面布局优化**:
  - 程序坞移到最左边（60px宽度）
  - 分组列表移到中间（280px宽度）
  - 聊天区域移到最右边（自适应宽度）
  - 移除底部空白，充分利用空间
  - 三栏布局更加合理
- **状态**: ✅ 优化完成

### 后端接口开发
- **类别接口**: `GET /category/list` - 获取所有启用的类别
- **用户接口**: `POST /auth/login` - 用户登录
- **注册接口**: `POST /auth/register` - 用户注册
- **验证码接口**: `POST /auth/sendVerifyCode` - 发送验证码
- **状态**: ✅ 所有接口正常工作

### 数据库设计
- **用户表**: 存储用户基本信息
- **类别表**: 存储平台类别信息
- **分组表**: 存储聊天分组信息
- **聊天消息表**: 存储聊天记录
- **工具表**: 存储平台工具信息
- **状态**: ✅ 数据库结构完整

### 技术栈
- **前端**: React Native Web
- **后端**: Spring Boot 3.4.5
- **数据库**: MySQL 8.0
- **ORM**: MyBatis
- **认证**: JWT
- **状态管理**: Redux Toolkit

### 当前功能状态
- ✅ 用户注册登录
- ✅ 验证码发送
- ✅ 类别选择页面 (重新设计完成)
- ✅ 聊天页面左右布局 (重新设计完成)
- ✅ 扁平化UI设计
- ✅ 前后端接口对接
- ✅ 参数传递错误修复

### 待开发功能
- 聊天功能 (WebSocket)
- 工具管理
- 分组管理
- 后台管理系统 

### 聊天窗口底部空白修复 (2024-08-04 更新)
- **问题**: 聊天窗口底部存在大片空白，浪费空间
- **解决方案**:
  - 为容器添加 `maxHeight: '100vh'` 和 `overflow: 'hidden'`
  - 为聊天区域添加 `maxHeight: 'calc(100vh - 32px)'`
  - 为输入框容器设置 `minHeight: 60px`
  - 为输入框和发送按钮设置 `minHeight: 36px`
  - 确保聊天区域充分利用可用空间
- **效果**: 移除底部空白，聊天区域完全填充屏幕
- **状态**: ✅ 修复完成 

### 聊天界面优化修复 (2024-08-04 更新)
- **消息时间显示优化**:
  - 改为每5分钟显示一次时间，而不是每条消息都显示
  - 时间显示在消息中间，使用灰色背景圆角样式
  - 添加时间格式化函数，显示为 HH:MM 格式
  - 优化时间显示逻辑，减少视觉干扰
- **输入框和发送按钮对齐修复**:
  - 统一输入框和发送按钮的高度为40px
  - 统一圆角为20px，更加圆润
  - 调整内边距，确保视觉平衡
  - 添加 `textAlignVertical: 'center'` 和 `lineHeight: 20` 确保文字垂直居中
  - 使用 `alignItems: 'center'` 确保输入框和按钮水平对齐
- **效果**: 聊天界面更加简洁，输入区域视觉统一
- **状态**: ✅ 修复完成 

### 后端Java代码规范修改 (2024-08-04 更新)
- **转换器层规范**:
  - 创建了 `UserConverter` 和 `CategoryConverter` 转换器类
  - 使用MapStruct框架进行DO与DTO转换
  - 遵循命名规范：`convertToDTO` 和 `convertToDO` 方法
  - 包含单个对象、列表、分页的转换方法
- **Repository层规范**:
  - 修改 `UserRepository` 和 `CategoryRepository` 接口
  - 继承 `IService<Entity>` 而不是直接操作DO
  - 使用转换器进行DO与DTO转换
  - 遵循命名规范：`find`(查多条)、`get`(查单条)、`save`、`update`、`delete`
  - 使用 `queryChain()` 和 `updateChain()` 方法，禁止原生SQL
- **Service层规范**:
  - 修改 `UserService` 和 `CategoryService` 接口
  - 移除所有DO类，只使用DTO
  - 移除异常捕获和日志记录
  - 所有异常向上抛出，由Spring统一处理
- **Controller层规范**:
  - 修改 `AuthController` 和 `CategoryController`
  - 移除所有异常捕获和日志记录
  - 使用新的Service接口方法
  - 统一使用 `R.ok()` 和 `R.error()` 方法
- **Mapper层规范**:
  - 修改 `UserMapper` 和 `CategoryMapper`
  - 只继承 `BaseMapper<EntityDO>`，移除所有SQL语句
  - 禁止使用 `@Select`、`@Insert`、`@Update` 等注解
- **DTO层规范**:
  - 修改 `User` DTO类，添加 `password` 字段
  - 使用 `@Data` 注解自动生成getter/setter
  - 修改 `R` 类，添加 `ok()` 方法
- **异常处理规范**:
  - 所有业务代码不允许捕获异常
  - 所有异常必须向上抛出
  - 只在Spring统一异常处理中记录error日志
- **日志规范**:
  - 所有层不允许出现日志记录
  - 只在异常处理时有error日志
- **状态**: ✅ 修复完成

### 后端Java代码依赖修复 (2024-08-04 更新)
- **依赖修复**:
  - 添加了MyBatis-Flex依赖：`mybatis-flex-spring-boot-starter`
  - 添加了MapStruct依赖：`mapstruct` 和 `mapstruct-processor`
  - 添加了Lombok依赖：`lombok`
  - 修复了版本兼容性问题
- **Repository层修复**:
  - 移除了 `IService` 继承，改为直接实现接口
  - 移除了 `ServiceImpl` 继承，改为直接实现接口
  - 使用 `DO::getXXX` 方式映射，移除TableDef引用
  - 修复了Mapper方法调用，使用正确的方法名
- **实体类修复**:
  - 在 `UserDO` 中添加了 `username` 字段和对应的getter/setter
- **编译和启动**:
  - ✅ 编译成功，无错误
  - ✅ 应用正常启动，进程ID: 42648
  - ✅ API接口正常响应
  - ✅ 类别列表接口返回数据正常
  - ✅ 登录接口正常响应（用户不存在时返回错误信息）
- **状态**: ✅ 修复完成，应用正常运行 

### WebSocket聊天功能实现 (2024-08-04 更新)
- **后端WebSocket实现**:
  - 添加了WebSocket和FastJSON2依赖
  - 创建了WebSocket配置类 `WebSocketConfig`
  - 实现了WebSocket鉴权拦截器 `WebSocketAuthInterceptor`
  - 创建了WebSocket消息处理器 `ChatController`
  - 使用Spring WebSocket + FastJSON2进行消息处理
- **聊天相关实体和DTO**:
  - 创建了 `ChatMessage`、`WebSocketMessage`、`ChatGroup` DTO类
  - 创建了 `ChatMessageDO`、`ChatGroupDO` 实体类
  - 创建了对应的转换器 `ChatMessageConverter`、`ChatGroupConverter`
  - 创建了对应的Mapper `ChatMessageMapper`、`ChatGroupMapper`
- **聊天服务层**:
  - 创建了 `ChatService` 接口和 `ChatServiceImpl` 实现类
  - 实现了群组查询、消息查询、消息保存功能
  - 添加了测试数据初始化功能
- **数据库表结构**:
  - 添加了 `chat_group` 表（聊天群组表）
  - 添加了 `chat_message` 表（聊天消息表）
  - 包含了必要的索引和字段
- **API接口**:
  - 创建了 `ChatApiController` 提供HTTP接口
  - 支持获取群组列表、获取消息列表、初始化测试数据
- **鉴权机制**:
  - WebSocket连接需要传递token进行鉴权
  - 未登录用户无法建立WebSocket连接
  - 使用token解析用户ID并验证用户存在性
- **消息处理**:
  - 支持发送消息、加入群组、离开群组
  - 消息实时广播到群组所有成员
  - 消息保存到数据库持久化
- **状态**: ✅ 后端实现完成，待前端对接 

### 数据库初始化脚本完善 (2024-08-04 更新)
- **init.sql文件完善**:
  - 补充了完整的分组数据插入语句
  - 添加了工具数据和工具展示范围数据
  - 添加了聊天群组数据
  - 添加了测试用户数据（5个用户，密码都是123456的BCrypt加密）
  - 添加了测试聊天消息数据（25条消息，分布在不同的群组）
  - 添加了用户工具关系数据（每个用户都有默认工具）
  - 添加了用户分组关系数据（用户加入不同的群组）
  - 更新了分组成员数量统计
- **数据完整性**:
  - 类别数据：5个类别（短视频主播、炒股、财经、程序员、设计师）
  - 分组数据：10个分组，每个类别2个分组
  - 工具数据：8个工具（AI助手、图片生成、文档翻译、代码生成、数据分析、视频剪辑、股票分析、财经资讯）
  - 聊天群组：10个群组，与分组对应
  - 测试用户：5个用户，手机号13800138001-13800138005
  - 测试消息：25条消息，分布在5个主要群组中
- **索引优化**:
  - 添加了复合索引优化查询性能
  - 为聊天消息、用户分组、用户工具等表添加了索引
  - 为验证码表添加了时间索引
- **外键约束**:
  - 提供了外键约束的SQL语句（注释状态）
  - 可根据实际需求决定是否启用
- **测试数据特点**:
  - 用户密码统一为123456的BCrypt加密
  - 消息时间使用相对时间（NOW() - INTERVAL）
  - 工具展示范围按类别分配
  - 群组成员数量正确统计
- **状态**: ✅ 数据库初始化脚本完成，包含完整的表结构和测试数据 

### DO类注解完善 (2024-08-04 更新)
- **DO类注解规范**:
  - 为所有DO类添加了 `@Table` 注解指定表名
  - 为所有DO类的主键字段添加了 `@Id` 注解
  - 确保MyBatis-Flex能正确识别表结构和主键
- **修改的DO类**:
  - `UserDO`: 添加 `@Table("user")` 和 `@Id` 注解
  - `CategoryDO`: 添加 `@Table("category")` 和 `@Id` 注解
  - `ChatGroupDO`: 已有 `@Table("chat_group")` 和 `@Id` 注解
  - `ChatMessageDO`: 已有 `@Table("chat_message")` 和 `@Id` 注解
- **注解规范**:
  - 所有DO类必须使用 `@Table` 注解指定对应的数据库表名
  - 所有DO类的主键字段必须使用 `@Id` 注解标识
  - 表名使用下划线命名法（snake_case）
  - 确保MyBatis-Flex能正确进行ORM映射
- **编译验证**:
  - ✅ 编译成功，无错误
  - ✅ MyBatis-Flex处理器正常运行
  - ✅ 所有DO类注解正确
- **状态**: ✅ 所有DO类注解完善完成 

### 修复username字段问题 (2024-08-04 更新)
- **问题描述**:
  - 用户是用手机号登录的，数据库表里没有username字段
  - 但UserDO和User DTO中都有username字段，导致字段不匹配
  - UserRepositoryImpl的update方法中还在使用UserDO::getUsername
- **修复内容**:
  - **UserDO**: 删除了username字段，只保留phone字段
  - **User DTO**: 删除了username字段，只保留phone字段
  - **UserRepositoryImpl**: 删除了update方法中的UserDO::getUsername调用
- **数据库表结构确认**:
  - `user`表只有`phone`字段，没有`username`字段
  - 用户登录使用手机号，符合业务需求
- **编译验证**:
  - ✅ 编译成功，无错误
  - ✅ MyBatis-Flex处理器正常运行
  - ✅ 字段映射正确
- **状态**: ✅ username字段问题修复完成，用户登录功能恢复正常 

### Spring统一异常处理实现 (2024-08-04 更新)
- **实现目标**:
  - 所有异常都被Spring统一处理
  - 返回给前端统一的R格式响应
  - 避免在业务代码中捕获异常
- **核心组件**:
  - **GlobalExceptionHandler**: Spring统一异常处理器
    - 处理业务异常(BusinessException)
    - 处理参数校验异常(MethodArgumentNotValidException)
    - 处理参数绑定异常(BindException)
    - 处理约束校验异常(ConstraintViolationException)
    - 处理运行时异常(RuntimeException)
    - 处理所有其他异常(Exception)
  - **BusinessException**: 自定义业务异常类
    - 支持自定义错误码和错误消息
    - 默认错误码为400
  - **R类增强**: 添加了带code参数的error方法
- **异常处理流程**:
  1. 业务层抛出BusinessException或其他异常
  2. Spring自动捕获异常
  3. GlobalExceptionHandler根据异常类型处理
  4. 返回统一的R格式响应
  5. 记录错误日志
- **响应格式统一**:
  ```json
  {
    "code": 400,
    "message": "手机号已存在",
    "data": null,
    "timestamp": 1640995200000
  }
  ```
- **已修改的Service**:
  - **UserServiceImpl**: 将RuntimeException替换为BusinessException
- **编译验证**:
  - ✅ 编译成功，无错误
  - ✅ 所有异常处理类正确
  - ✅ 依赖关系正确
- **状态**: ✅ Spring统一异常处理实现完成，所有异常都会被统一包装返回 

### 修复MapStruct转换问题 (2024-08-04 更新)
- **问题描述**:
  - UserConverter的convertToDO方法转换后属性都变成null
  - MapStruct无法正确识别User和UserDO的字段映射
  - 编译时MapStruct生成的实现类没有字段映射代码
- **根本原因**:
  - Maven编译器插件没有配置注解处理器
  - Lombok和MapStruct都需要在编译时处理注解
  - 缺少annotationProcessorPaths配置
- **修复内容**:
  - **pom.xml**: 为maven-compiler-plugin添加annotationProcessorPaths配置
    - 添加Lombok注解处理器
    - 添加MapStruct注解处理器
  - **UserDO**: 添加@Data注解，删除手动getter/setter
- **修复后的效果**:
  - ✅ MapStruct正确生成字段映射代码
  - ✅ convertToDTO和convertToDO方法正常工作
  - ✅ 所有字段都能正确转换
- **编译验证**:
  - ✅ 编译成功，无错误
  - ✅ MapStruct处理器正常运行
  - ✅ 字段映射正确生成
- **状态**: ✅ MapStruct转换问题修复完成，注册功能恢复正常 

### 聊天气泡样式优化 (当前)
- **问题**: 发出的消息与收到消息的聊天气泡与头像距离不一致，发出的消息气泡与头像太近
- **解决方案**: 
  1. 调整头像容器的margin为marginHorizontal: 8，确保左右距离一致
  2. 添加alignSelf: 'flex-end'让头像垂直对齐
  3. 为聊天气泡添加小尖角，使用CSS三角形实现
  4. 优化气泡小尖角的位置和大小，使用8px的边框宽度
  5. 调整小尖角的位置，让发出的消息小尖角在右侧，收到的消息小尖角在左侧
- **技术细节**: 使用CSS border技巧创建三角形小尖角，position: relative定位
- **效果**: 聊天气泡与头像距离保持一致，气泡样式更加精致美观 