import ChatMembers from '@components/Chat/SidePanel/ChatMembers/ChatMembers';
import ChatRoomHeader from '@components/Chat/SidePanel/ChatRoomHeader/ChatRoomHeader';

import { useChatRoomQuery } from '@hooks/services/queries/chat';
import classnames from 'classnames/bind';
import { memo } from 'react';
import { assert } from 'src/utils/assert';
import styles from './SidePanel.module.css';
const cx = classnames.bind(styles);

const SidePanel = ({ id }: { id: string }) => {
    const { data: chatRoom, isLoading, isError } = useChatRoomQuery(id);

    if (isLoading) {
        return <strong>채팅방을 불러오는 중입니다.</strong>;
    }

    assert(chatRoom !== undefined, '채팅방 정보가 존재하지 않습니다.');
    const { members } = chatRoom;
    if (isError) {
        return <strong>Error 발생! 잠시 후 다시 시도해주세요.</strong>;
    }
    return (
        <div className={cx('container')}>
            <ChatRoomHeader chatRoom={chatRoom} />
            <ChatMembers members={members} />
        </div>
    );
};

export default memo(SidePanel);
