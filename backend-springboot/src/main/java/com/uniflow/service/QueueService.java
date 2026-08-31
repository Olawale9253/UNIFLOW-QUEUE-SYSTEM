package com.uniflow.service;

import com.uniflow.dto.request.QueueRequest;
import com.uniflow.dto.response.LiveQueueResponse;
import com.uniflow.dto.response.QueueResponse;

import java.util.List;

public interface QueueService {
    QueueResponse joinQueue(QueueRequest request, Long userId);
    QueueResponse getQueueStatus(Long ticketId);
    List<QueueResponse> getUserQueues(Long userId);
    LiveQueueResponse getLiveQueue(Long officeId);
    QueueResponse callNextTicket(Long officeId, Long staffId);
    QueueResponse completeTicket(Long ticketId, Long staffId);
    QueueResponse skipTicket(Long ticketId, Long staffId);
    List<LiveQueueResponse> getAllLiveQueues();
}