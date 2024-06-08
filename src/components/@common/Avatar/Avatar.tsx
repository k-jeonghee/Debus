import { baseAuthAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import Bus from 'src/assets/bus.svg?react';
import styles from './Avatar.module.css';
const cx = classnames.bind(styles);

const Avatar = () => {
  const user = useAtomValue(baseAuthAtom);
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate(`/my-operation/${user.id}`);
    }
  };

  return (
    <div className={cx('wrapper')}>
      <a onClick={handleClick}>
        <Bus width="20" height="20" fill="#ffa16e" />
      </a>
    </div>
  );
};

export default Avatar;
