package com.bunchup.service.impl;

import com.bunchup.convert.ChatMessageConverter;
import com.bunchup.dto.ChatGroup;
import com.bunchup.dto.ChatMessage;
import com.bunchup.entity.ChatGroupDO;
import com.bunchup.entity.ChatMessageDO;
import com.bunchup.mapper.ChatGroupMapper;
import com.bunchup.mapper.ChatMessageMapper;
import com.bunchup.repository.ChatGroupRepository;
import com.bunchup.repository.ChatMessageRepository;
import com.bunchup.service.ChatService;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class ChatServiceImpl extends ServiceImpl<ChatMessageMapper, ChatMessageDO> implements ChatService {

    @Autowired
    private ChatGroupMapper chatGroupMapper;

    @Autowired
    private ChatGroupRepository chatGroupRepository;

    @Autowired
    private ChatMessageMapper chatMessageMapper;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Override
    public List<ChatGroup> getGroupsByCategory(Long categoryId) {
        return chatGroupRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<ChatMessage> getMessagesByGroup(Long groupId, int limit) {
        return chatMessageRepository.findByGroupId(groupId, limit);
    }

    @Override
    public void saveMessage(ChatMessage message) {
        chatMessageRepository.save(message.setSendTime(new Date()));
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