import { useMessageById } from '@hooks/services/queries/chat';
import { authAtom } from '@store/atoms/auth';
import { currentChatRoom } from '@store/atoms/chat';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import moment from 'moment';
import { memo } from 'react';
import { Message } from 'src/@types/chat';
import styles from './ChatMessage.module.css';
const cx = classnames.bind(styles);

type PropsType = {
  message: Message;
};

const ChatMessage = ({ message }: PropsType) => {
  const { uid } = useAtomValue(authAtom);
  const chatRoomId = useAtomValue(currentChatRoom);
  const { content, file, user } = useMessageById(chatRoomId, message.id);
  const isMyMessage = uid === message.user.id;
  const timeAgo = moment(Number(message.timestamp)).format('HH:mm');

  return (
    <div className={cx('container', { me: isMyMessage })}>
      <div className={cx('profile')}></div>
      <div className={cx('info')}>
        <strong className={cx('user-name')}>{user.name}</strong>
        <div className={cx('content')}>
          {file ? <img className={cx('file-img')} src={file} alt="이미지" /> : <p className={cx('text')}>{content}</p>}
          <span className={cx('timestamp')}>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatMessage);
