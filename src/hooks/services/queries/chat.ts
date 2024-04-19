import { UseSuspenseQueryResult, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { ChatRoomInfoType } from 'src/@types/chat';
import { getChatRoom, getMessage, getMessages } from 'src/api/firebase';

export const useChatRoomQuery: (chatRoomId: string) => UseSuspenseQueryResult<ChatRoomInfoType> = (
    chatRoomId: string,
) =>
    useSuspenseQuery(
        queryOptions({
            queryKey: ['chatRooms', chatRoomId],
            queryFn: () => getChatRoom(chatRoomId),
            staleTime: 5 * 1000,
        }),
    );

export const useMessageQuery = (chatRoomId: string) =>
    useSuspenseQuery({
        queryKey: ['chatRooms', chatRoomId, 'messages'],
        queryFn: () => getMessages(chatRoomId),
    });

export const useMessageByIdQuery = ({ chatRoomId, messageId }: { chatRoomId: string; messageId: string }) =>
    useSuspenseQuery({
        queryKey: ['chatRooms', chatRoomId, 'messages', messageId],
        queryFn: () => getMessage({ chatRoomId, messageId }),
    });
