import ChatForm from '@components/Chat/ChatPanel/ChatForm/ChatForm';
import ChatMessage from '@components/Chat/ChatPanel/ChatMessage/ChatMessage';

import { useMessageQuery } from '@hooks/services/queries/chat';
import classnames from 'classnames/bind';
import { useEffect } from 'react';
import { addMessageListener } from 'src/api/firebase';
import styles from './ChatPanel.module.css';

const cx = classnames.bind(styles);

const ChatPanel = ({ id }: { id: string }) => {
    const { data, refetch } = useMessageQuery(id);

    useEffect(() => addMessageListener(id, () => refetch()), [id, refetch]);

    const messages$ = data.map((message) => <ChatMessage key={message.id} message={message} />);

    return (
        <div className={cx('container')}>
            <div className={cx('chat-message-container')}>{messages$}</div>
            <ChatForm />
        </div>
    );
};

export default ChatPanel;
