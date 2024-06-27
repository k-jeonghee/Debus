import ChatPanel from '@components/Chat/ChatPanel/ChatPanel';
import SidePanel from '@components/Chat/SidePanel/SidePanel';
import ErrorRedirect from '@components/Error/ErrorRedirect';
import ErrorBoundary from '@components/ErrorBoundary/ErrorBoundary';
import { chatRoomByIdQueryOptions } from '@hooks/services/queries/chat';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateMemberListener } from 'src/api/firebase';
import { assert } from 'src/utils/assert';
import styles from './LinePage.module.css';
const cx = classnames.bind(styles);

const LinePage = () => {
  const { id: chatRoomId } = useParams();
  assert(chatRoomId !== undefined, '채팅방 id가 존재하지 않습니다.');
  const { data: chatRoom } = useSuspenseQuery(chatRoomByIdQueryOptions(chatRoomId));

  const queryClient = useQueryClient();
  useEffect(() => {
    return updateMemberListener(chatRoom.id, () =>
      queryClient.invalidateQueries(chatRoomByIdQueryOptions(chatRoom.id)),
    );
  }, [queryClient, chatRoom.id]);

  return (
    <ErrorBoundary Fallback={ErrorRedirect}>
      <div className={cx('container')}>
        <div className={cx('side')}>
          <SidePanel chatRoom={chatRoom} />
        </div>
        <div className={cx('chat')}>
          <ChatPanel chatRoomId={chatRoomId} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LinePage;
