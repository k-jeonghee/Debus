import ChatMembers from '@components/Chat/SidePanel/ChatMembers/ChatMembers';
import ChatRoomHeader from '@components/Chat/SidePanel/ChatRoomHeader/ChatRoomHeader';

import { useChatRoom } from '@hooks/services/queries/chat';
import classnames from 'classnames/bind';
import { memo } from 'react';
import styles from './SidePanel.module.css';
const cx = classnames.bind(styles);

const SidePanel = ({ chatRoomId }: { chatRoomId: string }) => {
  const chatRoom = useChatRoom(chatRoomId);
  const { members } = chatRoom;

  return (
    <div className={cx('container')}>
      <ChatRoomHeader chatRoom={chatRoom} />
      <ChatMembers members={members} />
    </div>
  );
};

export default memo(SidePanel);
