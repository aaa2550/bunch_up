import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useWebSocket = (url) => {
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(url),
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        setIsConnected(true);
      },
      onDisconnect: () => {
        console.log('Disconnected');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
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
