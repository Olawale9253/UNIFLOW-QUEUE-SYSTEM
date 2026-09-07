package com.uniflow.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class QueueWebSocketHandler extends TextWebSocketHandler {

    private static final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);

        Map<String, Object> welcome = Map.of(
                "event", "connect",
                "message", "Connected to WebSocket"
        );
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(welcome)));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Clients are read-only. Queue updates are handled through local connection events.
    }

    public void broadcast(Map<String, Object> payload) {
        String message = "";
        try {
            message = objectMapper.writeValueAsString(payload);
        } catch (Exception ex) {
            return;
        }

        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(message));
                } catch (Exception ignored) {
                    sessions.remove(session);
                }
            }
        }
    }
}