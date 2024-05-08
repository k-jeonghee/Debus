import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getChatRoom, getMessage, getMessages } from 'src/api/firebase';

export const chatRoomQueryOptions = <T>(chatRoomId: string, options?: T) =>
  queryOptions({
    queryKey: ['chatRooms', chatRoomId],
    queryFn: () => getChatRoom(chatRoomId),
    staleTime: 5 * 1000,
    ...options,
  });

export const messageQueryOptions = <T>(chatRoomId: string, options?: T) =>
  queryOptions({
    queryKey: ['chatRooms', chatRoomId, 'messages'],
    queryFn: () => getMessages(chatRoomId),
    ...options,
  });

export const messageByIdQueryOptions = <T>(chatRoomId: string, messageId: string, options?: T) =>
  queryOptions({
    queryKey: ['chatRooms', chatRoomId, 'messages', messageId],
    queryFn: () => getMessage({ chatRoomId, messageId }),
    staleTime: 60 * 1000,
    ...options,
  });

export const useChatRoom = (chatRoomId: string) => useSuspenseQuery(chatRoomQueryOptions(chatRoomId)).data;
export const useMessage = (chatRoomId: string) => useSuspenseQuery(messageQueryOptions(chatRoomId)).data;
export const useMessageById = (chatRoomId: string, messageId: string) =>
  useSuspenseQuery(messageByIdQueryOptions(chatRoomId, messageId)).data;
