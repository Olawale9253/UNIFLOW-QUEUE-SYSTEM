package com.uniflow.config;

import com.uniflow.websocket.QueueWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final QueueWebSocketHandler queueWebSocketHandler;

    public WebSocketConfig(QueueWebSocketHandler queueWebSocketHandler) {
        this.queueWebSocketHandler = queueWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        System.out.println("✅ WebSocketConfig is being loaded!");
        registry.addHandler(queueWebSocketHandler, "/ws")
            .setAllowedOrigins("*")
            .withSockJS();
        System.out.println("✅ WebSocket handler registered at /ws");
    }
}