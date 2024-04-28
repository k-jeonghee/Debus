import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNewMessage, createChatRoom as mutateChatRoom } from 'src/api/firebase';

const useChatRoomMutation = () => {
  const { mutate: createChatRoom } = useMutation({
    mutationFn: mutateChatRoom,
    onError: (err) => console.log(err),
  });
  return { createChatRoom };
};

export const useMessageMutation = (chatRoomId: string) => {
  const queryClient = useQueryClient();
  const { mutate: addMessage } = useMutation({
    mutationFn: addNewMessage,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['chatRooms', chatRoomId, 'messages'],
      }),
    onError: (err) => alert(`${err} 잠시 후 다시 시도해주세요.`),
  });
  return { addMessage };
};

export const useCreateChatRoom = () => useChatRoomMutation();
export const useAddMessage = useMessageMutation;
