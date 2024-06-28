import { authAtom } from '@store/atoms/auth';

import { FaCrown } from '@react-icons/all-files/fa/FaCrown';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { memo } from 'react';

import { Member } from 'src/@types/chat';
import styles from './ChatMembers.module.css';
const cx = classnames.bind(styles);

const ChatMembers = ({ members }: { members: Member[] }) => {
  const { id: uid } = useAtomValue(authAtom);
  return (
    <div className={cx('container')}>
      <h1>참여 ({members?.length})</h1>
      <ul>
        {members &&
          members.map((member) => (
            <li key={member.userId} className={cx('item')}>
              {member.name}
              {member.role === 'owner' && <FaCrown className={cx('icon')} />}
              {member.userId === uid && <span className={cx('me')}>나</span>}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default memo(ChatMembers);
