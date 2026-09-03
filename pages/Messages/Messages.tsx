import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ConversationList } from '../../components/messaging/ConversationList/ConversationList';
import { ChatWindow } from '../../components/messaging/ChatWindow/ChatWindow';
import { useMessages } from '../../hooks/useMessages';

export const Messages: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();

  // If no conversationId is in params, default to first or selected
  const [selectedId, setSelectedId] = useState<string | undefined>(conversationId || 'conv_1');

  const {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    isTyping,
    typingUser,
    sendMessage,
  } = useMessages(selectedId);

  const activeConversation = conversations.find((c) => c.id === selectedId);

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    navigate(`/messages/${id}`);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] min-h-[500px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
        {/* Left: Conversation List (Hidden on mobile if a conversation is actively open) */}
        <div
          className={`h-full ${
            selectedId ? 'hidden md:block md:col-span-4' : 'col-span-1 md:col-span-4'
          }`}
        >
          <ConversationList
            conversations={conversations}
            activeId={selectedId}
            loading={loadingConversations}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Right: Active Chat Window (Full on mobile when active) */}
        <div
          className={`h-full ${
            selectedId ? 'col-span-1 md:col-span-8' : 'hidden md:block md:col-span-8'
          }`}
        >
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            loading={loadingMessages}
            isTyping={isTyping}
            typingUser={typingUser}
            onSendMessage={sendMessage}
            onBack={() => {
              setSelectedId(undefined);
              navigate('/messages');
            }}
          />
        </div>
      </div>
    </div>
  );
};
