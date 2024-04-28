import ChatForm from '@components/Chat/ChatPanel/ChatForm/ChatForm';
import ChatMessage from '@components/Chat/ChatPanel/ChatMessage/ChatMessage';

import { messageQueryOptions, useMessage } from '@hooks/services/queries/chat';
import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { memo, useEffect } from 'react';
import { addMessageListener } from 'src/api/firebase';
import styles from './ChatPanel.module.css';

const cx = classnames.bind(styles);

const ChatPanel = ({ chatRoomId }: { chatRoomId: string }) => {
  const messages = useMessage(chatRoomId);
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
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <ChatForm />
    </div>
  );
};

export default memo(ChatPanel);
