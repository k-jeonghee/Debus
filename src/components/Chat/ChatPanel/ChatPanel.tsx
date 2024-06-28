import ChatForm from '@components/Chat/ChatPanel/ChatForm/ChatForm';
import ChatMessage from '@components/Chat/ChatPanel/ChatMessage/ChatMessage';

import Loading from '@components/@common/Loading/Loading';
import { chatKeys, messageQueryOptions } from '@hooks/services/queries/chat';
import { authAtom } from '@store/atoms/auth';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { Suspense, memo, useEffect, useRef } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { Message } from 'src/@types/chat';
import { addMessageListener } from 'src/api/firebase';
import styles from './ChatPanel.module.css';

const cx = classnames.bind(styles);

const ChatPanel = ({ chatRoomId }: { chatRoomId: string }) => {
  const { id: uid } = useAtomValue(authAtom);
  const queryClient = useQueryClient();
  const { data: messages } = useSuspenseQuery(messageQueryOptions(chatRoomId));

  /**
   * 새로운 메시지 전송 시 스크롤 위치 이동
   */
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  useEffect(() => {
    virtuosoRef.current!.scrollToIndex({
      index: messages.length - 1,
    });
  }, [messages]);

  useEffect(() => {
    const handleMessage = (newMessages: Message[]) => {
      queryClient.setQueryData(chatKeys.messages(chatRoomId), (): Message[] => {
        return newMessages ?? [];
      });
    };

    return addMessageListener(chatRoomId, handleMessage);
  }, [chatRoomId, queryClient]);

  return (
    <Suspense fallback={<Loading />}>
      <div className={cx('container')}>
        <div className={cx('chat-message-container')}>
          <Virtuoso
            ref={virtuosoRef}
            data={messages}
            itemContent={(_, message) => (
              <ChatMessage key={message.id} message={message} isMyMessage={uid === message.user.id} />
            )}
          />
        </div>
        {<ChatForm chatRoomId={chatRoomId} />}
      </div>
    </Suspense>
  );
};

export default memo(ChatPanel);
