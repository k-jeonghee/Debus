import ActionModal from '@components/@common/Modal/ModalContents/Action/ActionModal';
import ChatRooms from '@components/Chat/ChatRooms';
import { useModal } from '@hooks/useModal';
import { useEffect } from 'react';

const HomePage = () => {
  const { ModalContainer, openModal } = useModal();

  useEffect(() => {
    const hasSeenDemoAlert = sessionStorage.getItem('hasSeenDemoAlert');
    if (!hasSeenDemoAlert) {
      openModal(ActionModal, {
        type: 'confirm',
        message: '로그인 버튼을 누르면 익명 로그인으로 전환되어 별도 가입 없이 테스트가 가능합니다.',
        displayCancel: false,
      });
      sessionStorage.setItem('hasSeenDemoAlert', 'true');
    }
  }, [openModal]);

  return (
    <>
      <ChatRooms />
      <ModalContainer />
    </>
  );
};

export default HomePage;
