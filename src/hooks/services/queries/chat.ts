import { queryOptions } from '@tanstack/react-query';
import { getChatRoom, getChatRooms, getChatRoomsByUser, getMessages } from 'src/api/firebase';

export const chatKeys = {
  chatRooms: ['chatRooms'] as const,
  chatRoomById: (chatRoomId: string) => ['chatRoom', chatRoomId] as const,
  chatRoomsByUser: (userId: string) => [...chatKeys.chatRooms, userId] as const,
  messages: (chatRoomId: string) => [...chatKeys.chatRoomById(chatRoomId), 'messages'] as const,
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
    staleTime: 1000 * 60 * 4,
  });
