import Button from '@components/@common/Button/Button';
import CreateChatRoomModal from '@components/@common/Modal/ModalContents/CreateChatRoom/CreateChatRoomModal';
import { useCreateChatRoom } from '@hooks/services/mutations/chat';
import { useModal } from '@hooks/useModal';
import { baseAuthAtom } from '@store/atoms/auth';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { login } from 'src/api/firebase';

const ChatRooms = () => {
  const user = useAtomValue(baseAuthAtom);
  const navigate = useNavigate();
  const { openModal, ModalContainer } = useModal();
  const { mutate } = useCreateChatRoom({
    onSuccess: (chatRoomId: string) => navigate(`/lines/${chatRoomId}`),
  });

  const handleCreate = async () => {
    if (!user) return login();
    try {
      const chatRoomInfo = await openModal(CreateChatRoomModal);
      mutate({ user, chatRoomInfo });
    } catch (err) {
      console.log('모달 닫습니다~!');
    }
  };

  return (
    <>
      <section>
        <h1>정류장</h1>
        <nav>
          <Button text="배차하기" variant="accent" onClick={handleCreate} />
        </nav>
      </section>
      <ModalContainer />
    </>
  );
};

export default ChatRooms;
