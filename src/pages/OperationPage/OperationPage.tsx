import ChatPanel from '@components/Chat/ChatPanel/ChatPanel';
import ErrorFallback from '@components/Error/ErrorFallback';
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import BlankPanel from '@components/Operation/BlankPanel/BlankPanel';
import MyChatRooms from '@components/Operation/MyChatRooms/MyChatRooms';
import { chatRoomsByUserQueryOptions } from '@hooks/services/queries/chat';
import { authAtom } from '@store/atoms/auth';
import { currentChatRoom } from '@store/atoms/chat';
import { useSuspenseQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

import styles from './OperationPage.module.css';
const cx = classnames.bind(styles);

const OperationPage = () => {
  const user = useAtomValue(authAtom);

  const [curChatRoomId, setCurChatRoomId] = useAtom(currentChatRoom);
  const { data: chatRoomIds } = useSuspenseQuery(chatRoomsByUserQueryOptions(user.id));

  useEffect(() => setCurChatRoomId(''), [setCurChatRoomId]);

  return (
    <ErrorBoundary Fallback={ErrorFallback}>
      <div className={cx('container')}>
        <MyChatRooms chatRoomIds={chatRoomIds} />
        {curChatRoomId ? <ChatPanel chatRoomId={curChatRoomId} /> : <BlankPanel />}
      </div>
    </ErrorBoundary>
  );
};

export default OperationPage;
