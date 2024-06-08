import { messageByIdQueryOptions } from '@hooks/services/queries/chat';
import { UserTypes } from '@store/atoms/auth';
import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatRoomInfo, Message } from 'src/@types/chat';
import { addNewMessage, createChatRoom } from 'src/api/firebase';

export type createChatRoomMutateType = { user: UserTypes; chatRoomInfo: ChatRoomInfo; nickName: string };
export const useCreateChatRoom = (options?: UseMutationOptions<string, Error, createChatRoomMutateType>) =>
  useMutation({
    mutationFn: createChatRoom,
    ...options,
  });

export type addMessageMutateType = { chatRoomId: string; message: Omit<Message, 'id' | 'timestamp'> };
export const useAddMessage = (
  chatRoomId: string,
  options: UseMutationOptions<Message, Error, addMessageMutateType>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addNewMessage,
    onSuccess: (v: Message) => queryClient.invalidateQueries(messageByIdQueryOptions(chatRoomId, v.id)),
    ...options,
  });
};
