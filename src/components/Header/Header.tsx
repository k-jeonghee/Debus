import Avatar from '@components/@common/Avatar/Avatar';
import ThemeButton from '@components/@common/ThemeButton/ThemeButton';
import { baseAuthAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { Link } from 'react-router-dom';
import { login, logout } from 'src/api/firebase';
import styles from './Header.module.css';
const cx = classnames.bind(styles);

const Header = () => {
  const user = useAtomValue(baseAuthAtom);
  return (
    <header id={cx('header')}>
      <div className={cx('header')}>
        <h1 className={cx('header-logo')}>
          <Link to={'/'}>
            <h1>DeBus</h1>
          </Link>
        </h1>
        <div className={cx('header-right')}>
          <ThemeButton />
          {user && <Avatar />}
          {user ? (
            <button className={cx('btn-login')} onClick={logout}>
              로그아웃
            </button>
          ) : (
            <button className={cx('btn-login')} onClick={login}>
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
