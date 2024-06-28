import Loading from '@components/@common/Loading/Loading';
import ChatForm from '@components/Chat/ChatPanel/ChatForm/ChatForm';
import ChatMessage from '@components/Chat/ChatPanel/ChatMessage/ChatMessage';
import { chatKeys, messageQueryOptions } from '@hooks/services/queries/chat';
import { authAtom } from '@store/atoms/auth';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { Suspense, memo, useEffect, useRef } from 'react';
import { Message } from 'src/@types/chat';
import { addMessageListener } from 'src/api/firebase';
import styles from './ChatPanel.module.css';

const cx = classnames.bind(styles);

const ChatPanel = ({ chatRoomId }: { chatRoomId: string }) => {
  const { id: uid } = useAtomValue(authAtom);
  const queryClient = useQueryClient();
  const { data: messages } = useSuspenseQuery(messageQueryOptions(chatRoomId));

  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleMessage = (newMessages: Message[]) => {
      queryClient.setQueryData(chatKeys.messages(chatRoomId), (): Message[] => newMessages ?? []);
    };

    return addMessageListener(chatRoomId, handleMessage);
  }, [chatRoomId, queryClient, uid]);

  useEffect(() => {
    const lastMessageRef = messageRefs.current[messageRefs.current.length - 1];
    lastMessageRef?.scrollIntoView();
  }, [messages]);

  return (
    <Suspense fallback={<Loading />}>
      <div className={cx('container')}>
        <div className={cx('chat-message-container')}>
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isMyMessage={uid === message.user.id}
              ref={(el) => (messageRefs.current[index] = el)}
            />
          ))}
        </div>
        {<ChatForm chatRoomId={chatRoomId} />}
      </div>
    </Suspense>
  );
};

export default memo(ChatPanel);
