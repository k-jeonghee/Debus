import { UserTypes } from '@store/atoms/auth';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { ChatRoomInfo, Message } from 'src/@types/chat';
import { addNewMessage, createChatRoom } from 'src/api/firebase';

type MutateOptionsType<T, U> = UseMutationOptions<T, Error, U>;

export type createChatRoomMutateType = { user: UserTypes; chatRoomInfo: ChatRoomInfo; nickName: string };
export const useCreateChatRoom = (options: MutateOptionsType<string, createChatRoomMutateType>) =>
  useMutation({
    mutationFn: createChatRoom,
    ...options,
  });

export type addMessageMutateType = { chatRoomId: string; message: Omit<Message, 'id' | 'timestamp'> };
export const useAddMessage = (options: MutateOptionsType<Message, addMessageMutateType>) => {
  return useMutation({
    mutationFn: addNewMessage,

    ...options,
  });
};
