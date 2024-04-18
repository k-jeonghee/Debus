import { authAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import moment from 'moment';
import { Message } from 'src/@types/chat';
import styles from './ChatMessages.module.css';
const cx = classnames.bind(styles);

type PropsType = {
    message: Message;
};

const ChatMessages = ({ message }: PropsType) => {
    const { uid } = useAtomValue(authAtom);
    const isMyMessage = uid === message.user.id;
    const timeAgo = moment(Number(message.timestamp)).fromNow();

    return (
        <div className={cx('container', { me: isMyMessage })}>
            <div className={cx('user-img')}></div>
            <div>
                <div className={cx('info')}>
                    <strong className={cx('user-name')}>{message.user.name}</strong>
                    <span className={cx('timestamp')}>{timeAgo}</span>
                </div>
                <p className={cx('content')}>{message.content}</p>
            </div>
        </div>
    );
};

export default ChatMessages;
