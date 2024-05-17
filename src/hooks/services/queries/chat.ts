import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getChatRoom, getChatRooms, getMessage, getMessages } from 'src/api/firebase';

export const chatKeys = {
  chatRooms: ['chatRooms'] as const,
  chatRoomById: (chatRoomId: string) => [...chatKeys.chatRooms, chatRoomId] as const,
  messages: (chatRoomId: string) => [...chatKeys.chatRoomById(chatRoomId), 'messages'] as const,
  messageById: (chatRoomId: string, messageId: string) => [...chatKeys.messages(chatRoomId), messageId] as const,
};

export const chatRoomQueryOptions = <T>(options?: T) =>
  queryOptions({
    queryKey: chatKeys.chatRooms,
    queryFn: getChatRooms,
    ...options,
  });

export const chatRoomByIdQueryOptions = <T>(chatRoomId: string, options?: T) =>
  queryOptions({
    queryKey: chatKeys.chatRoomById(chatRoomId),
    queryFn: () => getChatRoom(chatRoomId),
    staleTime: 5 * 1000,
    ...options,
  });

export const messageQueryOptions = <T>(chatRoomId: string, options?: T) =>
  queryOptions({
    queryKey: chatKeys.messages(chatRoomId),
    queryFn: () => getMessages(chatRoomId),
    ...options,
  });

export const messageByIdQueryOptions = <T>(chatRoomId: string, messageId: string, options?: T) =>
  queryOptions({
    queryKey: chatKeys.messageById(chatRoomId, messageId),
    queryFn: () => getMessage({ chatRoomId, messageId }),
    staleTime: 60 * 1000,
    ...options,
  });

export const useChatRoom = () => useSuspenseQuery(chatRoomQueryOptions()).data;
export const useChatRoomById = (chatRoomId: string) => useSuspenseQuery(chatRoomByIdQueryOptions(chatRoomId)).data;
export const useMessage = (chatRoomId: string) => useSuspenseQuery(messageQueryOptions(chatRoomId)).data;
export const useMessageById = (chatRoomId: string, messageId: string) =>
  useSuspenseQuery(messageByIdQueryOptions(chatRoomId, messageId)).data;
