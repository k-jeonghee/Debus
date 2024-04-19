import { useMessageByIdQuery } from '@hooks/services/queries/chat';
import { authAtom } from '@store/atoms/auth';
import { currentChatRoom } from '@store/atoms/chat';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import moment from 'moment';
import { Message } from 'src/@types/chat';
import styles from './ChatMessage.module.css';
const cx = classnames.bind(styles);

type PropsType = {
    message: Message;
};

const ChatMessage = ({ message }: PropsType) => {
    const { uid } = useAtomValue(authAtom);
    const chatRoomId = useAtomValue(currentChatRoom);
    const { data } = useMessageByIdQuery({ chatRoomId, messageId: message.id });
    const isMyMessage = uid === message.user.id;
    const timeAgo = moment(Number(message.timestamp)).format('HH:mm');

    return (
        <div className={cx('container', { me: isMyMessage })}>
            <div className={cx('user-img')}></div>
            <strong className={cx('user-name')}>{data.user.name}</strong>
            <div className={cx('info')}>
                <p className={cx('content')}>{data.content}</p>
                <span className={cx('timestamp')}>{timeAgo}</span>
            </div>
        </div>
    );
};

export default ChatMessage;
