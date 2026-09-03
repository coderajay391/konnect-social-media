import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message } from '../types';
import { messageApi } from '../services/api/messageApi';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export function useMessages(activeConversationId?: string) {
  const { user } = useAuth();
  const { socket, simulateIncomingMessage } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const data = await messageApi.getConversations();
      setConversations(data);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const fetchMessages = useCallback(async (convId: string) => {
    setLoadingMessages(true);
    try {
      const data = await messageApi.getMessages(convId);
      setMessages(data);
      if (user) {
        await messageApi.markAsRead(convId, user.id);
      }
    } finally {
      setLoadingMessages(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId, fetchMessages]);

  // Real-time socket event listeners
  useEffect(() => {
    const unsubMsg = socket.on('message:received', (newMsg: Message) => {
      if (newMsg.conversationId === activeConversationId) {
        setMessages((prev) => [...prev, newMsg]);
      }

      // Update conversation last message in list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === newMsg.conversationId
            ? { ...c, lastMessage: newMsg, updatedAt: newMsg.createdAt }
            : c
        )
      );
    });

    const unsubTyping = socket.on('user:typing', (data: { conversationId: string; isTyping: boolean; user: string }) => {
      if (data.conversationId === activeConversationId) {
        setIsTyping(data.isTyping);
        setTypingUser(data.isTyping ? data.user : null);
      }
    });

    return () => {
      unsubMsg();
      unsubTyping();
    };
  }, [socket, activeConversationId]);

  const sendMessage = async (text: string, mediaUrl?: string) => {
    if (!activeConversationId || !user || (!text.trim() && !mediaUrl)) return;

    try {
      const newMsg = await messageApi.sendMessage(activeConversationId, user.id, text, mediaUrl);
      setMessages((prev) => [...prev, newMsg]);

      // Update conversation in list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, lastMessage: newMsg, updatedAt: newMsg.createdAt }
            : c
        )
      );

      // Trigger automatic realistic simulated reply after 1.8s for interactive demo experience
      const conv = conversations.find((c) => c.id === activeConversationId);
      const recipient = conv?.participants.find((p) => p.id !== user.id);
      if (recipient) {
        const demoReplies = [
          "That's awesome! Let's definitely follow up on that.",
          "Thanks for the update! Looking forward to testing it out.",
          "Sounds perfect. I'll review the pull request shortly!",
          "Great points! Let me know when the next release is ready.",
          "Awesome work as always! 🔥",
        ];
        const randomReply = demoReplies[Math.floor(Math.random() * demoReplies.length)];
        simulateIncomingMessage(activeConversationId, recipient.name, randomReply);
      }

      return newMsg;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  return {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    isTyping,
    typingUser,
    sendMessage,
    refreshConversations: fetchConversations,
    refreshMessages: () => activeConversationId && fetchMessages(activeConversationId),
  };
}
