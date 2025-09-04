package com.bunchup.mapper;

import com.bunchup.entity.GamePlayerDO;
import com.mybatisflex.core.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface GamePlayerMapper extends BaseMapper<GamePlayerDO> {
    
    @Select("SELECT * FROM game_player WHERE room_id = #{roomId}")
    List<GamePlayerDO> selectByRoomId(String roomId);
    
    @Select("SELECT * FROM game_player WHERE room_id = #{roomId} AND user_id = #{userId}")
    GamePlayerDO selectByRoomAndUser(String roomId, Long userId);
    
    @Select("SELECT * FROM game_player WHERE user_id = #{userId} AND status = 'playing'")
    List<GamePlayerDO> selectActivePlayersByUser(Long userId);
    
    @Select("SELECT COUNT(*) FROM game_player WHERE room_id = #{roomId} AND status != 'disconnected'")
    Integer countActivePlayersByRoom(String roomId);
}