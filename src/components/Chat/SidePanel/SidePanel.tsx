import Button from '@components/@common/Button/Button';
import ActionModal from '@components/@common/Modal/ModalContents/Action/ActionModal';
import ChatMembers from '@components/Chat/SidePanel/ChatMembers/ChatMembers';
import ChatRoomHeader from '@components/Chat/SidePanel/ChatRoomHeader/ChatRoomHeader';
import { useModal } from '@hooks/useModal';
import { authAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatRoomInfoType } from 'src/@types/chat';
import { exitChatRoom } from 'src/api/firebase';
import styles from './SidePanel.module.css';
const cx = classnames.bind(styles);

const SidePanel = ({ chatRoom }: { chatRoom: ChatRoomInfoType }) => {
  const { uid } = useAtomValue(authAtom);
  const { openModal, ModalContainer } = useModal();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const res = await openModal(ActionModal, { type: 'exit', message: '채팅방에서 나가면 기록을 복구할 수 없어요.' });
      if (res) {
        const curMembersCount = chatRoom.members.length;
        try {
          await exitChatRoom(uid, chatRoom.id, curMembersCount === 1);
          navigate(`/`);
        } catch (err) {
          //삭제 실패
          console.log(err);
        }
      }
    } catch (err) {
      //사용자가 직접 모달을 닫음
      console.log(err);
    }
  };

  return (
    <div className={cx('container')}>
      <div>
        <ChatRoomHeader chatRoom={chatRoom} />
        <ChatMembers members={chatRoom.members} />
      </div>
      <Button text="나가기" variant="accent" onClick={handleClick} />
      <ModalContainer />
    </div>
  );
};

export default memo(SidePanel);
