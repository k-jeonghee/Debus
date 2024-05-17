import ChatPanel from '@components/Chat/ChatPanel/ChatPanel';
import SidePanel from '@components/Chat/SidePanel/SidePanel';
import { useChatRoomById } from '@hooks/services/queries/chat';
import classnames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import { assert } from 'src/utils/assert';
import styles from './LinePage.module.css';
const cx = classnames.bind(styles);

const LinePage = () => {
  const { id: chatRoomId } = useParams();
  assert(chatRoomId !== undefined, '채팅방 id가 존재하지 않습니다.');
  const chatRoom = useChatRoomById(chatRoomId);

  return (
    <div className={cx('container')}>
      <div className={cx('side')}>
        <SidePanel chatRoom={chatRoom} />
      </div>
      <div className={cx('chat')}>
        <ChatPanel chatRoom={chatRoom} />
      </div>
    </div>
  );
};

export default LinePage;
