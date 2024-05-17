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
import { useNavigate } from 'react-router-dom';
import { login } from 'src/api/firebase';
import styles from './ChatRooms.module.css';
const cx = classnames.bind(styles);

const ChatRooms = () => {
  const user = useAtomValue(baseAuthAtom);
  const navigate = useNavigate();
  const { openModal: chatRoomModal, ModalContainer: ChatRoomModalContainer } = useModal();
  const { openModal: nickNameModal, ModalContainer: NickNameModalContainer } = useModal();
  const chatRooms = useChatRoom();
  const { mutate } = useCreateChatRoom({
    onSuccess: (chatRoomId: string) => navigate(`/lines/${chatRoomId}`),
  });

  const handleCreate = async () => {
    if (!user) return login();
    try {
      const chatRoomInfo = await chatRoomModal(CreateChatRoomModal);
      const { nickName } = await nickNameModal(UpdateNickName);
      mutate({ user, chatRoomInfo, nickName });
    } catch (err) {
      console.log('모달 닫습니다~!');
    }
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
            <ChatRoom key={chatRoom.id} chatRoom={chatRoom} />
          ))}
        </ul>
      )}
      <ChatRoomModalContainer />
      <NickNameModalContainer />
    </section>
  );
};

export default ChatRooms;
