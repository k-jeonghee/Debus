import ChatForm from '@components/Chat/ChatPanel/ChatForm/ChatForm';
import ChatMessages from '@components/Chat/ChatPanel/ChatMessages/ChatMessages';

import { useMessageQuery } from '@hooks/services/queries/chat';
import classnames from 'classnames/bind';
import { useEffect } from 'react';
import { addMessageListener } from 'src/api/firebase';
import styles from './ChatPanel.module.css';

const cx = classnames.bind(styles);

const ChatPanel = ({ id }: { id: string }) => {
    const { data, refetch } = useMessageQuery(id);

    useEffect(() => addMessageListener(id, () => refetch()), [id, refetch]);

    const messages$ = data.map((message) => <ChatMessages key={message.id} message={message} />);

    return (
        <div className={cx('container')}>
            <div className={cx('chat-message-container')}>{messages$}</div>
            <ChatForm />
        </div>
    );
};

export default ChatPanel;
