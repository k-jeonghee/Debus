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
import { useToast } from 'src/context/ToastContext';
import styles from './SidePanel.module.css';
const cx = classnames.bind(styles);

const SidePanel = ({ chatRoom }: { chatRoom: ChatRoomInfoType }) => {
  const { id: uid } = useAtomValue(authAtom);
  const { openModal, ModalContainer } = useModal();
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = async () => {
    const result = await openModal(ActionModal, {
      type: 'exit',
      message: '채팅방에서 나가면 기록을 복구할 수 없어요.',
      displayCancel: true,
    });
    if (!result.ok) return;
    const curMembersCount = chatRoom.members.length;
    try {
      await exitChatRoom(uid, chatRoom.id, curMembersCount === 1);
      navigate('/');
    } catch (err) {
      toast.add({ type: 'failure', message: '잠시 후 다시 시도해주세요.' });
    }
  };

  return (
    <div className={cx('container')}>
      <div>
        <ChatRoomHeader chatRoom={chatRoom} />
        <ChatMembers members={chatRoom.members} />
      </div>
      <Button text="나가기" variant="accent" onClick={handleClick} name="exit-chatRoom" />
      <ModalContainer />
    </div>
  );
};

export default memo(SidePanel);
