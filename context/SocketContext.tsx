import React, { createContext, useContext, useEffect } from 'react';
import { socketService } from '../services/socket/socket';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: typeof socketService;
  emit: (event: string, data: any) => void;
  simulateIncomingMessage: (conversationId: string, senderName: string, text: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  const emit = (event: string, data: any) => {
    socketService.emit(event, data);
  };

  const simulateIncomingMessage = (conversationId: string, senderName: string, text: string) => {
    socketService.simulateReply(conversationId, senderName, text);
  };

  return (
    <SocketContext.Provider value={{ socket: socketService, emit, simulateIncomingMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
