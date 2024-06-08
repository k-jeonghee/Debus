import { useMessageById } from '@hooks/services/queries/chat';
import classnames from 'classnames/bind';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { memo } from 'react';
import { Message } from 'src/@types/chat';
import styles from './ChatMessage.module.css';
const cx = classnames.bind(styles);

type PropsType = {
  message: Message;
} & {
  chatRoomId: string;
  isMyMessage: boolean;
};

const ChatMessage = ({ message, chatRoomId, isMyMessage }: PropsType) => {
  const { content, file } = useMessageById(chatRoomId, message.id);
  const timeAgo = format(Number(message.timestamp), 'a HH:mm', { locale: ko });

  return (
    <div className={cx('container', { me: isMyMessage })}>
      <div className={cx('profile')}></div>
      <div className={cx('info')}>
        <strong className={cx('user-name')}>{message.user.name}</strong>
        <div className={cx('content')}>
          {file ? (
            <img className={cx('file-img')} src={file} alt="이미지" />
          ) : (
            <pre className={cx('text')}>{content}</pre>
          )}
          <span className={cx('timestamp')}>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatMessage);
