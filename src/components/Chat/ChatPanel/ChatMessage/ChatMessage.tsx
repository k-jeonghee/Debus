import { messageByIdQueryOptions } from '@hooks/services/queries/chat';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { memo } from 'react';
import { Message } from 'src/@types/chat';
import Bus from 'src/assets/bus.svg?react';
import styles from './ChatMessage.module.css';
const cx = classnames.bind(styles);

type PropsType = {
  message: Message;
} & {
  chatRoomId: string;
  isMyMessage: boolean;
};

const ChatMessage = ({ message, chatRoomId, isMyMessage }: PropsType) => {
  const { data } = useQuery(messageByIdQueryOptions(chatRoomId, message.id));
  const timeAgo = format(Number(message.timestamp), 'a HH:mm', { locale: ko });

  return (
    <div className={cx('container', { me: isMyMessage })}>
      <div className={cx('profile')}>
        <Bus width="20" height="20" fill="#1e2226" />
      </div>
      <div className={cx('info')}>
        <strong className={cx('user-name')}>{message.user.name}</strong>
        <div className={cx('content')}>
          {data && data.file ? (
            <img className={cx('file-img')} src={data.file} alt="이미지" />
          ) : (
            <pre className={cx('text')}>{data && data.content}</pre>
          )}
          <span className={cx('timestamp')}>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatMessage);
