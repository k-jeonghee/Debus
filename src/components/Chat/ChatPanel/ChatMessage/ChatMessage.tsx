import classnames from 'classnames/bind';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { forwardRef, memo } from 'react';
import { Message } from 'src/@types/chat';
import Bus from 'src/assets/bus.svg?react';
import styles from './ChatMessage.module.css';
const cx = classnames.bind(styles);

type PropsType = {
  message: Message;

  isMyMessage: boolean;
};

const ChatMessage = forwardRef<HTMLDivElement, PropsType>(({ message, isMyMessage }, ref) => {
  const timeAgo = format(Number(message.timestamp), 'a HH:mm', { locale: ko });

  return (
    <div className={cx('container', { me: isMyMessage })} ref={ref}>
      <div className={cx('profile')}>
        <Bus width="20" height="20" fill="#1e2226" />
      </div>
      <div className={cx('info')}>
        <strong className={cx('user-name')}>{message.user.name}</strong>
        <div className={cx('content')}>
          {message.file ? (
            <img className={cx('file-img')} src={message.file} alt="이미지" />
          ) : (
            <pre className={cx('text')}>{message.content}</pre>
          )}
          <span className={cx('timestamp')}>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default memo(ChatMessage);
