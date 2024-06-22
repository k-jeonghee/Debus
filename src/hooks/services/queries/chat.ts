import { queryOptions } from '@tanstack/react-query';
import { getChatRoom, getChatRooms, getChatRoomsByUser, getMessage, getMessages } from 'src/api/firebase';

export const chatKeys = {
  chatRooms: ['chatRooms'] as const,
  chatRoomById: (chatRoomId: string) => [...chatKeys.chatRooms, chatRoomId] as const,
  chatRoomsByUser: (userId: string) => [...chatKeys.chatRooms, userId] as const,
  messages: (chatRoomId: string) => [...chatKeys.chatRoomById(chatRoomId), 'messages'] as const,
  messageById: (chatRoomId: string, messageId: string) => [...chatKeys.messages(chatRoomId), messageId] as const,
};

export const chatRoomQueryOptions = () =>
  queryOptions({
    queryKey: chatKeys.chatRooms,
    queryFn: getChatRooms,
  });

export const chatRoomByIdQueryOptions = (chatRoomId: string) =>
  queryOptions({
    queryKey: chatKeys.chatRoomById(chatRoomId),
    queryFn: () => getChatRoom(chatRoomId),
  });

export const chatRoomsByUserQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: chatKeys.chatRoomsByUser(userId),
    queryFn: () => getChatRoomsByUser(userId),
  });

export const messageQueryOptions = (chatRoomId: string) =>
  queryOptions({
    queryKey: chatKeys.messages(chatRoomId),
    queryFn: () => getMessages(chatRoomId),
    staleTime: 200000,
  });

export const messageByIdQueryOptions = (chatRoomId: string, messageId: string) => {
  return queryOptions({
    queryKey: chatKeys.messageById(chatRoomId, messageId),
    queryFn: () => getMessage(chatRoomId, messageId),
  });
};
