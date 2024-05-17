import ChatForm from '@components/Chat/ChatPanel/ChatForm/ChatForm';
import ChatMessage from '@components/Chat/ChatPanel/ChatMessage/ChatMessage';

import { messageQueryOptions, useMessage } from '@hooks/services/queries/chat';
import { authAtom } from '@store/atoms/auth';
import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { memo, useEffect } from 'react';
import { ChatRoomInfoType } from 'src/@types/chat';
import { addMessageListener } from 'src/api/firebase';
import { assert } from 'src/utils/assert';
import styles from './ChatPanel.module.css';

const cx = classnames.bind(styles);

const ChatPanel = ({ chatRoom }: { chatRoom: ChatRoomInfoType }) => {
  const { uid } = useAtomValue(authAtom);
  const { id: chatRoomId, members } = chatRoom;
  const messages = useMessage(chatRoomId);
  //접속한 채팅방 멤버 중 로그인 사용자의 정보
  const memberInfo = members.find((member) => member.userId === uid);
  assert(memberInfo !== undefined, '채팅방에 존재하지 않는 사용자입니다.');

  const queryClient = useQueryClient();
  useEffect(
    () =>
      addMessageListener(chatRoomId, () =>
        queryClient.refetchQueries(
          messageQueryOptions(chatRoomId, {
            placeholderData: keepPreviousData,
          }),
        ),
      ),
    [chatRoomId, queryClient],
  );

  return (
    <div className={cx('container')}>
      <div className={cx('chat-message-container')}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            chatRoomId={chatRoomId}
            isMyMessage={uid === message.user.id}
          />
        ))}
      </div>
      <ChatForm nickName={memberInfo.name} chatRoomId={chatRoomId} />
    </div>
  );
};

export default memo(ChatPanel);
