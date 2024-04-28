import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { getChatRoom, getMessage, getMessages } from 'src/api/firebase';

const useChatRoomQuery = (chatRoomId: string) => useSuspenseQuery(chatRoomQueryOptions(chatRoomId));
export const chatRoomQueryOptions = <T>(chatRoomId: string, options?: T) =>
  queryOptions({
    queryKey: ['chatRooms', chatRoomId],
    queryFn: () => getChatRoom(chatRoomId),
    staleTime: 5 * 1000,
    ...options,
  });

const useMessageQuery = (chatRoomId: string) => useSuspenseQuery(messageQueryOptions(chatRoomId));
export const messageQueryOptions = <T>(chatRoomId: string, options?: T) =>
  queryOptions({
    queryKey: ['chatRooms', chatRoomId, 'messages'],
    queryFn: () => getMessages(chatRoomId),
    ...options,
  });

const useMessageByIdQuery = (chatRoomId: string, messageId: string) =>
  useSuspenseQuery(messageByIdQueryOptions(chatRoomId, messageId));
export const messageByIdQueryOptions = <T>(chatRoomId: string, messageId: string, options?: T) =>
  queryOptions({
    queryKey: ['chatRooms', chatRoomId, 'messages', messageId],
    queryFn: () => getMessage({ chatRoomId, messageId }),
    staleTime: 60 * 1000,
    ...options,
  });

export const useChatRoom = (chatRoomId: string) => useChatRoomQuery(chatRoomId).data;
export const useMessage = (chatRoomId: string) => useMessageQuery(chatRoomId).data;
export const useMessageById = (chatRoomId: string, messageId: string) =>
  useMessageByIdQuery(chatRoomId, messageId).data;
