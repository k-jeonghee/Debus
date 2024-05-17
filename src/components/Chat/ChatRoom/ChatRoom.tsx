import UpdateNickName from '@components/@common/Modal/ModalContents/UpdateNickName/UpdateNickName';
import { useModal } from '@hooks/useModal';
import { baseAuthAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { ChatRoomInfoType } from 'src/@types/chat';
import { bindUserAndChatRoom, checkUserInChatRoom, login } from 'src/api/firebase';
import { assert } from 'src/utils/assert';
import styles from './ChatRoom.module.css';
const cx = classnames.bind(styles);

const ChatRoom = ({ chatRoom }: { chatRoom: ChatRoomInfoType }) => {
  const { id: chatRoomId, title, desc, options, members, status } = chatRoom;
  const user = useAtomValue(baseAuthAtom);
  const { openModal, ModalContainer } = useModal();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!user) {
      try {
        await login();
      } catch (err) {
        console.log('로그인 실패');
      }
    }
    assert(user !== null, '사용자 정보가 없습니다.');
    try {
      const joined = await checkUserInChatRoom(user, chatRoomId);
      if (!joined) {
        if (members.length === 4) return confirm('채팅방에 빈자리가 없어요.🥲');
        const { nickName } = await openModal(UpdateNickName);
        await bindUserAndChatRoom(user.uid, chatRoomId, nickName);
      }
      navigate(`/lines/${chatRoomId}`);
    } catch {
      console.log('채팅방에 입장할 수 없습니다.');
    }
  };

  return (
    <li className={cx('container')} onClick={handleClick}>
      <div>
        <h2 className={cx('id')}>No. {[...chatRoomId].slice(1, 6)}</h2>
        <strong className={cx('title')}>{title}</strong>
        <p className={cx('desc')}>{desc}</p>
        {options.length > 1 && (
          <ul className={cx('option_list')}>
            {options.map((option, idx) => (
              <li className={cx('option_item')} key={idx}>
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={cx('footer')}>
        <strong>🚍 {status === 'pending' ? '대기중' : '운행중'}</strong>
        <p className={cx('member')}>
          <span className={cx('count')}>{members.length}</span>/4
        </p>
      </div>
      <ModalContainer />
    </li>
  );
};

export default ChatRoom;
