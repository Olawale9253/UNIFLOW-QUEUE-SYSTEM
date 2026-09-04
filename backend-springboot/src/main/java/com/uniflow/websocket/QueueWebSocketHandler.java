package com.uniflow.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class QueueWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session);
        System.out.println("✅ WebSocket connection established! Total: " + sessions.size());

        // Send welcome message
        Map<String, Object> welcome = new HashMap<>();
        welcome.put("event", "connect");
        welcome.put("message", "Connected to WebSocket");
        welcome.put("totalConnections", sessions.size());
        session.sendMessage(new TextMessage(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(welcome)));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
        System.out.println("❌ WebSocket connection closed. Total: " + sessions.size());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("Received message: " + payload);

        // Echo back
        Map<String, Object> response = new HashMap<>();
        response.put("event", "echo");
        response.put("message", "Echo: " + payload);
        session.sendMessage(new TextMessage(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(response)));
    }
}