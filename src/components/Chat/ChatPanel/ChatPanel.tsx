import ChatForm from '@components/Chat/ChatPanel/ChatForm/ChatForm';
import ChatMessage from '@components/Chat/ChatPanel/ChatMessage/ChatMessage';

import Loading from '@components/@common/Loading/Loading';
import { chatRoomByIdQueryOptions, messageQueryOptions } from '@hooks/services/queries/chat';
import { authAtom } from '@store/atoms/auth';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { Suspense, memo, useEffect } from 'react';
import { addMessageListener } from 'src/api/firebase';
import styles from './ChatPanel.module.css';

const cx = classnames.bind(styles);

const ChatPanel = ({ chatRoomId }: { chatRoomId: string }) => {
  const { id: uid } = useAtomValue(authAtom);
  const { data: messages } = useSuspenseQuery(messageQueryOptions(chatRoomId));
  const { data: memberInfo } = useSuspenseQuery({
    ...chatRoomByIdQueryOptions(chatRoomId),
    select: (data) => data.members.find((member) => member.userId === uid),
  });

  const queryClient = useQueryClient();
  useEffect(
    () => addMessageListener(chatRoomId, () => queryClient.invalidateQueries(messageQueryOptions(chatRoomId))),
    [chatRoomId, queryClient],
  );

  return (
    <Suspense fallback={<Loading />}>
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
        {memberInfo && <ChatForm nickName={memberInfo.name} chatRoomId={chatRoomId} />}
      </div>
    </Suspense>
  );
};

export default memo(ChatPanel);
