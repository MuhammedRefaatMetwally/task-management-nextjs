'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG, STORAGE_KEYS } from '@/config/api.config';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificationsStore } from '@/lib/stores/notifications-store';

export function useWebSocket(projectId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const addNotification = useNotificationsStore((state) => state.addNotification);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return;

    const socket = io(API_CONFIG.WS_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      
      if (projectId) {
        socket.emit('join-project', projectId);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    socket.on('task:created', (task) => {
      console.log(' Task created:', task);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project', task.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects', task.projectId] });
    });

    socket.on('task:updated', (task) => {
      console.log(' Task updated:', task);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project', task.projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', task.id] });
    });

    socket.on('task:moved', (task) => {
      console.log(' Task moved:', task);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project', task.projectId] });
    });

    socket.on('task:deleted', (data) => {
      console.log('Task deleted:', data);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project', data.projectId] });
    });

    socket.on('tasks:reordered', () => {
      console.log('Tasks reordered');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    });

    socket.on('notification', (notification) => {
      console.log(' Notification received:', notification);
      addNotification(notification);
    });

    return () => {
      if (projectId) {
        socket.emit('leave-project', projectId);
      }
      socket.disconnect();
    };
  }, [projectId, queryClient, addNotification]);

  return socketRef.current;
}