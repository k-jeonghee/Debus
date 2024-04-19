import { chatKeys } from '@hooks/services/queries/chat';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNavigate } from 'react-router-dom';
import { addNewMessage, createChatRoom } from 'src/api/firebase';

export const useChatRoomMutation = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: createChatRoom,
        onSuccess: (id) => navigate(`/lines/${id}`),
        onError: (err) => console.log(err),
    });
};

export const useMessageMutation = (chatRoomId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addNewMessage,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: chatKeys.messages(chatRoomId),
            }),
        onError: (err) => alert(`${err} 잠시 후 다시 시도해주세요.`),
    });
};
