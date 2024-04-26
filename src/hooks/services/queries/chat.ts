import { UseSuspenseQueryResult, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { ChatRoomInfoType } from 'src/@types/chat';
import { getChatRoom, getMessage, getMessages } from 'src/api/firebase';

export const chatKeys = {
    chatRooms: ['chatRooms'] as const,
    chatRoomById: (chatRoomId: string) => [...chatKeys.chatRooms, chatRoomId] as const,
    messages: (chatRoomId: string) => [...chatKeys.chatRoomById(chatRoomId), 'messages'] as const,
    messageById: (chatRoomId: string, messageId: string) => [...chatKeys.messages(chatRoomId), messageId] as const,
};

export const useChatRoomQuery: (chatRoomId: string) => UseSuspenseQueryResult<ChatRoomInfoType> = (
    chatRoomId: string,
) =>
    useSuspenseQuery(
        queryOptions({
            queryKey: chatKeys.chatRoomById(chatRoomId),
            queryFn: () => getChatRoom(chatRoomId),
            staleTime: 5 * 1000,
        }),
    );

export const useMessageQuery = (chatRoomId: string) =>
    useSuspenseQuery({
        queryKey: chatKeys.messages(chatRoomId),
        queryFn: () => getMessages(chatRoomId),
        staleTime: 60 * 1000,
    });

export const useMessageByIdQuery = ({ chatRoomId, messageId }: { chatRoomId: string; messageId: string }) =>
    useSuspenseQuery({
        queryKey: chatKeys.messageById(chatRoomId, messageId),
        queryFn: () => getMessage({ chatRoomId, messageId }),
        staleTime: 60 * 1000,
    });
