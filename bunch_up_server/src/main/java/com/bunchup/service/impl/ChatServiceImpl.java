package com.bunchup.service.impl;

import com.bunchup.convert.ChatGroupConverter;
import com.bunchup.convert.ChatMessageConverter;
import com.bunchup.dto.ChatGroup;
import com.bunchup.dto.ChatMessage;
import com.bunchup.entity.ChatGroupDO;
import com.bunchup.entity.ChatMessageDO;
import com.bunchup.mapper.ChatGroupMapper;
import com.bunchup.mapper.ChatMessageMapper;
import com.bunchup.service.ChatService;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatServiceImpl extends ServiceImpl<ChatMessageMapper, ChatMessageDO> implements ChatService {
    
    @Autowired
    private ChatGroupMapper chatGroupMapper;
    
    @Autowired
    private ChatMessageMapper chatMessageMapper;
    
    @Override
    public List<ChatGroup> getGroupsByCategory(Long categoryId) {
        List<ChatGroupDO> groupDOList = chatGroupMapper.selectListByQuery(
            com.mybatisflex.core.query.QueryWrapper.create()
                .where(ChatGroupDO::getCategoryId).eq(categoryId)
                .where(ChatGroupDO::getStatus).eq(1)
        );
        return ChatGroupConverter.INSTANCE.convertToDTO(groupDOList);
    }
    
    @Override
    public List<ChatMessage> getMessagesByGroup(Long groupId, int limit) {
        List<ChatMessageDO> messageDOList = chatMessageMapper.selectListByQuery(
            com.mybatisflex.core.query.QueryWrapper.create()
                .select(ChatMessageDO::getId, ChatMessageDO::getUserId, ChatMessageDO::getUserName, 
                       ChatMessageDO::getGroupId, ChatMessageDO::getContent, ChatMessageDO::getMessageType, 
                       ChatMessageDO::getSendTime, ChatMessageDO::getStatus)
                .where(ChatMessageDO::getGroupId).eq(groupId)
                .where(ChatMessageDO::getStatus).eq(1)
                .orderBy(ChatMessageDO::getSendTime).asc() // 改为升序，显示时间顺序
                .limit(limit)
        );
        
        // 添加调试日志
        System.out.println("查询到的消息数量: " + messageDOList.size());
        if (!messageDOList.isEmpty()) {
            System.out.println("第一条消息示例: " + messageDOList.get(0));
        }
        
        return ChatMessageConverter.INSTANCE.convertToDTO(messageDOList);
    }
    
    @Override
    public ChatMessage saveMessage(ChatMessage message) {
        // 确保消息包含完整的用户信息
        if (message.getUserName() == null || message.getUserName().isEmpty()) {
            // 如果没有用户名，尝试从用户ID获取
            // 这里可以注入UserService来获取用户信息，暂时使用默认值
            message.setUserName("用户" + message.getUserId());
        }
        
        ChatMessageDO messageDO = ChatMessageConverter.INSTANCE.convertToDO(message);
        messageDO.setSendTime(LocalDateTime.now());
        messageDO.setStatus(1);
        chatMessageMapper.insert(messageDO);
        return ChatMessageConverter.INSTANCE.convertToDTO(messageDO);
    }
    
    @Override
    public void initTestData() {
        // 检查是否已有数据
        Long count = chatGroupMapper.selectCountByQuery(
            com.mybatisflex.core.query.QueryWrapper.create()
        );
        
        if (count == 0) {
            // 创建测试群组
            ChatGroupDO group1 = createTestGroup("短视频主播交流群", "分享短视频创作经验", 1L);
            ChatGroupDO group2 = createTestGroup("炒股技术交流群", "股票投资技术分析", 2L);
            ChatGroupDO group3 = createTestGroup("财经资讯群", "财经新闻资讯分享", 3L);
            
            chatGroupMapper.insert(group1);
            chatGroupMapper.insert(group2);
            chatGroupMapper.insert(group3);
            
            // 创建测试消息
            createTestMessages(group1.getId());
            createTestMessages(group2.getId());
            createTestMessages(group3.getId());
        }
    }
    
    private ChatGroupDO createTestGroup(String name, String description, Long categoryId) {
        ChatGroupDO group = new ChatGroupDO();
        group.setName(name);
        group.setDescription(description);
        group.setAvatar("/icons/group.png");
        group.setCategoryId(categoryId);
        group.setStatus(1);
        group.setCreateTime(LocalDateTime.now());
        group.setUpdateTime(LocalDateTime.now());
        return group;
    }
    
    private void createTestMessages(Long groupId) {
        String[] messages = {
            "大家好，欢迎来到群组！",
            "今天天气不错",
            "有什么新消息吗？",
            "分享一个有趣的内容",
            "大家有什么想法？"
        };
        
        String[] userNames = {
            "主播小王",
            "投资达人",
            "财经专家"
        };
        
        for (int i = 0; i < messages.length; i++) {
            ChatMessageDO message = new ChatMessageDO();
            message.setUserId((long) (i % 3 + 1)); // 模拟3个用户
            message.setGroupId(groupId);
            message.setContent(messages[i]);
            message.setMessageType(1);
            message.setSendTime(LocalDateTime.now().minusHours(i));
            message.setStatus(1);
            message.setUserName(userNames[i % 3]); // 设置用户昵称
            chatMessageMapper.insert(message);
        }
    }
} 