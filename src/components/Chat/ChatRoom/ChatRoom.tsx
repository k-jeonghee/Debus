import UpdateNickName from '@components/@common/Modal/ModalContents/UpdateNickName/UpdateNickName';
import { chatRoomByIdQueryOptions } from '@hooks/services/queries/chat';
import { useModal } from '@hooks/useModal';
import { baseAuthAtom } from '@store/atoms/auth';
import { useSuspenseQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { memo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { bindUserAndChatRoom, checkUserInChatRoom, login } from 'src/api/firebase';
import { useToast } from 'src/context/ToastContext';
import { assert } from 'src/utils/assert';
import styles from './ChatRoom.module.css';
const cx = classnames.bind(styles);

const ChatRoom = ({ chatRoomId }: { chatRoomId: string }) => {
  const { data: chatRoom } = useSuspenseQuery(chatRoomByIdQueryOptions(chatRoomId));
  const { id, title, desc, options, members, status } = chatRoom;
  const user = useAtomValue(baseAuthAtom);
  const { openModal, ModalContainer } = useModal();
  const navigate = useNavigate();
  const toast = useToast();

  const handleClick = async () => {
    if (!user) {
      try {
        await login();
      } catch (err) {
        toast.add({ type: 'failure', message: '로그인에 실패했어요' });
      }
    }
    assert(user !== null, '사용자 정보가 없습니다.');
    try {
      const joined = await checkUserInChatRoom(user, id);
      if (!joined) {
        if (members.length === 4) return confirm('채팅방에 빈자리가 없어요.🥲');
        const nickName = await openModal(UpdateNickName);
        if (!nickName.ok) return;
        await bindUserAndChatRoom(user.id, id, nickName.value!.nickName);
      }
      navigate(`/lines/${id}`);
    } catch {
      toast.add({ type: 'failure', message: '채팅방 입장에 실패했어요.' });
    }
  };

  //마지막 참여자가 나가서 채팅방이 삭제되었을 때의 에러 처리
  if (!chatRoom.members) {
    return <Navigate to={'/'} />;
  }

  return (
    <li className={cx('container')} onClick={handleClick}>
      <div>
        <h2 className={cx('id')}>No. {[...id].slice(1, 6)}</h2>
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

export default memo(ChatRoom);
