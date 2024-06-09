import ChatPanel from '@components/Chat/ChatPanel/ChatPanel';
import ErrorFallback from '@components/Error/ErrorFallback';
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import BlankPanel from '@components/Operation/BlankPanel/BlankPanel';
import MyChatRooms from '@components/Operation/MyChatRooms/MyChatRooms';
import { chatRoomsByUserQueryOptions } from '@hooks/services/queries/chat';
import { currentChatRoom } from '@store/atoms/chat';
import { useSuspenseQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assert } from 'src/utils/assert';
import styles from './OperationPage.module.css';
const cx = classnames.bind(styles);

const OperationPage = () => {
  const { userId } = useParams();
  assert(userId !== undefined, '사용자 ID를 찾을 수 없어요.');
  const [curChatRoomId, setCurChatRoomId] = useAtom(currentChatRoom);
  const { data: chatRoomIds } = useSuspenseQuery({ ...chatRoomsByUserQueryOptions(userId) });

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
