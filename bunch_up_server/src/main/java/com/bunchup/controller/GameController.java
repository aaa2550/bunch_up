package com.bunchup.controller;

import com.bunchup.common.R;
import com.bunchup.dto.GameRoom;
import com.bunchup.dto.GamePlayer;
import com.bunchup.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "游戏管理", description = "游戏相关接口")
@RestController
@RequestMapping("/api/v1/game")
public class GameController {

    @Autowired
    private GameService gameService;

    @Operation(summary = "加入游戏房间")
    @PostMapping("/join")
    public R<GameRoom> joinGame(@RequestBody Map<String, Object> request) {
        String roomId = (String) request.get("roomId");
        String gameType = (String) request.get("gameType");
        
        // 从roomId中解析出groupId (格式: groupId_gameType)
        Long groupId;
        try {
            String[] parts = roomId.split("_");
            groupId = Long.parseLong(parts[0]);
        } catch (Exception e) {
            throw new RuntimeException("无效的房间ID格式: " + roomId);
        }
        
        // 临时使用固定用户ID，实际项目中应该从JWT Token获取
        Long userId = 1L; 
        String playerName = "玩家" + userId;
        
        GameRoom gameRoom = gameService.joinGame(roomId, gameType, groupId, userId, playerName);
        return R.ok(gameRoom);
    }

    @Operation(summary = "离开游戏房间")
    @PostMapping("/leave")
    public R<Void> leaveGame(@RequestBody Map<String, Object> request) {
        String roomId = (String) request.get("roomId");
        
        // TODO: 从认证信息中获取当前用户ID
        Long userId = 1L;
        
        gameService.leaveGame(roomId, userId);
        return R.ok(null);
    }

    @Operation(summary = "获取游戏房间信息")
    @GetMapping("/room/{roomId}")
    public R<GameRoom> getGameRoom(@PathVariable String roomId) {
        GameRoom gameRoom = gameService.getGameRoom(roomId);
        return R.ok(gameRoom);
    }

    @Operation(summary = "开始游戏")
    @PostMapping("/start")
    public R<Void> startGame(@RequestBody Map<String, Object> request) {
        String roomId = (String) request.get("roomId");
        
        // TODO: 从认证信息中获取当前用户ID
        Long userId = 1L;
        
        gameService.startGame(roomId, userId);
        return R.ok(null);
    }

    @Operation(summary = "更新玩家得分")
    @PostMapping("/score")
    public R<Void> updateScore(@RequestBody Map<String, Object> request) {
        String roomId = (String) request.get("roomId");
        Integer score = (Integer) request.get("score");
        
        // TODO: 从认证信息中获取当前用户ID
        Long userId = 1L;
        
        gameService.updatePlayerScore(roomId, userId, score);
        return R.ok(null);
    }

    @Operation(summary = "更新玩家状态")
    @PostMapping("/state")
    public R<Void> updatePlayerState(@RequestBody Map<String, Object> request) {
        String roomId = (String) request.get("roomId");
        Object playerState = request.get("playerState");
        
        // TODO: 从认证信息中获取当前用户ID
        Long userId = 1L;
        
        gameService.updatePlayerState(roomId, userId, playerState);
        return R.ok(null);
    }

    @Operation(summary = "游戏结束")
    @PostMapping("/end")
    public R<Void> endGame(@RequestBody Map<String, Object> request) {
        String roomId = (String) request.get("roomId");
        Integer finalScore = (Integer) request.get("finalScore");
        
        // TODO: 从认证信息中获取当前用户ID
        Long userId = 1L;
        
        gameService.endGame(roomId, userId, finalScore);
        return R.ok(null);
    }

    @Operation(summary = "获取房间玩家列表")
    @GetMapping("/room/{roomId}/players")
    public R<List<GamePlayer>> getRoomPlayers(@PathVariable String roomId) {
        List<GamePlayer> players = gameService.getRoomPlayers(roomId);
        return R.ok(players);
    }

    @Operation(summary = "获取游戏排行榜")
    @GetMapping("/leaderboard")
    public R<List<GamePlayer>> getLeaderboard(
            @RequestParam(defaultValue = "snake") String gameType,
            @RequestParam(defaultValue = "10") Integer limit) {
        List<GamePlayer> leaderboard = gameService.getLeaderboard(gameType, limit);
        return R.ok(leaderboard);
    }
}