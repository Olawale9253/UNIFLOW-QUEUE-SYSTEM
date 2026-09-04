import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = {};
        this.connected = false;
    }

    connect(token) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected');
            return;
        }

        const wsUrl = 'http://localhost:8081/ws';
        console.log('Connecting to WebSocket at:', wsUrl);

        // Use SockJS for better compatibility
        this.ws = new SockJS(wsUrl);

        this.ws.onopen = () => {
            console.log('✅ WebSocket connected!');
            this.connected = true;
            this.notifyListeners('connect', {});
        };

        this.ws.onclose = () => {
            console.log('❌ WebSocket disconnected');
            this.connected = false;
            this.notifyListeners('disconnect', {});
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.notifyListeners('error', { error });
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Message received:', data);

                if (data.event === 'queue-update') {
                    this.notifyListeners('queue-update', data);
                } else if (data.event === 'notification') {
                    this.notifyListeners('notification', data);
                } else if (data.event === 'queue-position') {
                    this.notifyListeners('queue-position', data);
                } else if (data.event === 'connect') {
                    this.notifyListeners('connect', data);
                }
            } catch (e) {
                console.error('Error parsing message:', e);
            }
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.connected = false;
        }
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
        } else {
            console.warn('WebSocket not connected, cannot send:', data);
        }
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    notifyListeners(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in listener for ${event}:`, error);
                }
            });
        }
    }

    isConnected() {
        return this.connected && this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

const websocketService = new WebSocketService();
export default websocketService;