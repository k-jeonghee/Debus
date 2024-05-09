import Loading from '@components/@common/Loading/Loading';
import ChatPanel from '@components/Chat/ChatPanel/ChatPanel';
import SidePanel from '@components/Chat/SidePanel/SidePanel';
import { currentChatRoom } from '@store/atoms/chat';
import classnames from 'classnames/bind';
import { useAtom } from 'jotai';
import { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assert } from 'src/utils/assert';
import styles from './LinePage.module.css';
const cx = classnames.bind(styles);

const LinePage = () => {
  const [currentChatRoomId, setCurrentChatRoomId] = useAtom(currentChatRoom);
  const { id } = useParams();
  assert(id !== undefined, '채팅방 id가 존재하지 않습니다.');

  useEffect(() => {
    setCurrentChatRoomId(id);
  }, [id, setCurrentChatRoomId]);

  return (
    <Suspense fallback={<Loading />}>
      <div className={cx('container')}>
        <div className={cx('side')}>
          <SidePanel chatRoomId={currentChatRoomId} />
        </div>
        <div className={cx('chat')}>
          <ChatPanel chatRoomId={currentChatRoomId} />
        </div>
      </div>
    </Suspense>
  );
};

export default LinePage;
