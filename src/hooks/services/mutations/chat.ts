import { messageQueryOptions } from '@hooks/services/queries/chat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNewMessage, createChatRoom } from 'src/api/firebase';

export const useCreateChatRoom = ({ onSuccess }: { onSuccess: (chatRoomId: string) => void }) =>
  useMutation({
    mutationFn: createChatRoom,
    onSuccess,
    onError: (err) => console.log(err),
  });

export const useAddMessage = (chatRoomId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addNewMessage,
    onSuccess: () => queryClient.invalidateQueries(messageQueryOptions(chatRoomId)),
    onError: (err) => alert(`${err} 잠시 후 다시 시도해주세요.`),
  });
};
