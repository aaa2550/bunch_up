import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useWebSocket = (url) => {
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 检查用户是否已登录
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('useWebSocket - 检查用户登录状态:', user);
    
    if (!user.id || !user.token) {
      console.warn('useWebSocket - 用户未登录，无法连接WebSocket');
      return;
    }

    console.log('useWebSocket - 用户已登录，开始连接WebSocket');
    const client = new Client({
      webSocketFactory: () => new SockJS(url),
      connectHeaders: {
        'token': user.token
      },
      onConnect: (frame) => {
        console.log('useWebSocket - 连接成功: ' + frame);
        setIsConnected(true);
      },
      onDisconnect: () => {
        console.log('useWebSocket - 连接断开');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('useWebSocket - 连接错误: ' + frame.headers['message']);
        console.error('useWebSocket - 错误详情: ' + frame.body);
        setIsConnected(false);
      },
       reconnectDelay: 5000,
       heartbeatIncoming: 4000,
       heartbeatOutgoing: 4000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [url]);

  const subscribe = (destination, callback) => {
    if (isConnected && clientRef.current) {
      return clientRef.current.subscribe(destination, (message) => {
        try {
            const parsedMessage = JSON.parse(message.body);
            callback(parsedMessage);
        } catch(e) {
            console.error("Could not parse message body", message.body, e);
        }
      });
    }
  };

  const sendMessage = (destination, body) => {
    if (isConnected && clientRef.current) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  };

  return { isConnected, subscribe, sendMessage };
};

export default useWebSocket;
