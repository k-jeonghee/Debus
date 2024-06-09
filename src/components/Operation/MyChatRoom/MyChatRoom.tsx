import { chatRoomByIdQueryOptions, messageQueryOptions } from '@hooks/services/queries/chat';
import { currentChatRoom } from '@store/atoms/chat';
import { useSuspenseQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { format } from 'date-fns';
import { useSetAtom } from 'jotai';
import { useMemo, useTransition } from 'react';
import styles from './MyChatRoom.module.css';
const cx = classnames.bind(styles);

const MyChatRoom = ({ chatRoomId }: { chatRoomId: string }) => {
  const { data: chatRoom } = useSuspenseQuery({ ...chatRoomByIdQueryOptions(chatRoomId) });
  const { data: messages } = useSuspenseQuery({ ...messageQueryOptions(chatRoomId) });
  const setCurChatRoomId = useSetAtom(currentChatRoom);
  const { title, members } = chatRoom;
  const lastMessage = messages.length !== 0 && messages[messages.length - 1];
  const [, startTransition] = useTransition();

  const handleChangeChatRoom = () => {
    startTransition(() => setCurChatRoomId(chatRoomId));
  };

  const formattedTime = useMemo(() => {
    return lastMessage ? format(Number(lastMessage.timestamp), 'HH:mm') : '';
  }, [lastMessage]);

  return (
    <li className={cx('container')} onClick={handleChangeChatRoom}>
      <div className={cx('header')}>
        <div className={cx('info')}>
          <strong className={cx('title')}>{title}</strong>
          {members && <p className={cx('count')}>{members.length}</p>}
        </div>
        <p className={cx('time')}>{formattedTime}</p>
      </div>
      <div className={cx('content')}>
        {lastMessage && <p className={cx('msg')}>{lastMessage.file ? '이미지.jpg' : lastMessage.content}</p>}
      </div>
    </li>
  );
};

export default MyChatRoom;
