import Button from '@components/@common/Button/Button';
import CreateChatRoomModal from '@components/@common/Modal/ModalContents/CreateChatRoom/CreateChatRoomModal';
import UpdateNickName from '@components/@common/Modal/ModalContents/UpdateNickName/UpdateNickName';
import ChatRoom from '@components/Chat/ChatRoom/ChatRoom';
import { useCreateChatRoom } from '@hooks/services/mutations/chat';
import { useChatRoom } from '@hooks/services/queries/chat';
import { useModal } from '@hooks/useModal';
import { baseAuthAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from 'src/api/firebase';

import { useToast } from 'src/context/ToastContext';
import styles from './ChatRooms.module.css';
const cx = classnames.bind(styles);

const ChatRooms = () => {
  const user = useAtomValue(baseAuthAtom);
  const navigate = useNavigate();
  const { openModal: chatRoomModal, ModalContainer: ChatRoomModalContainer } = useModal();
  const { openModal: nickNameModal, ModalContainer: NickNameModalContainer } = useModal();
  const toast = useToast();
  const chatRooms = useChatRoom();
  const { mutate } = useCreateChatRoom({
    onSuccess: (chatRoomId: string) => {
      toast.add({ type: 'success', message: '채팅방이 생성되었어요' });
      navigate(`/lines/${chatRoomId}`);
    },
    onError: (err: Error) => {
      console.log(err);
      toast.add({ type: 'failure', message: `잠시 후 다시 시도해주세요.` });
    },
  });
  const handleCreate = async () => {
    if (!user) return login();

    const chatRoomInfo = await chatRoomModal(CreateChatRoomModal);
    if (!chatRoomInfo.ok || !chatRoomInfo.value) return;

    const nickNameResult = await nickNameModal(UpdateNickName);
    if (!nickNameResult.ok || !nickNameResult.value) return;
    const { nickName } = nickNameResult.value;

    mutate({ user, chatRoomInfo: chatRoomInfo.value, nickName });
  };

  return (
    <section className={cx('container')}>
      <nav className={cx('nav')}>
        <h1>정류장</h1>
        <Button text="배차하기" variant="accent" onClick={handleCreate} />
      </nav>
      {chatRooms && (
        <ul className={cx('list')}>
          {chatRooms.map((chatRoom) => (
            <ChatRoom key={chatRoom.id} chatRoomId={chatRoom.id} />
          ))}
        </ul>
      )}
      <ChatRoomModalContainer />
      <NickNameModalContainer />
    </section>
  );
};

export default memo(ChatRooms);
