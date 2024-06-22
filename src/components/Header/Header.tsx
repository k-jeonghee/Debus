import Avatar from '@components/@common/Avatar/Avatar';
import ThemeButton from '@components/@common/ThemeButton/ThemeButton';
import { baseAuthAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { Link, useNavigate } from 'react-router-dom';
import { login } from 'src/api/firebase';
import styles from './Header.module.css';
const cx = classnames.bind(styles);

const Header = () => {
  const user = useAtomValue(baseAuthAtom);
  const navigate = useNavigate();
  const handleLogin = () => {
    login().then(() => {
      navigate('/');
    });
  };

  return (
    <header id={cx('header')}>
      <div className={cx('header')}>
        <Link to={'/'}>
          <h1>DeBus</h1>
        </Link>
        <div className={cx('header-right')}>
          <ThemeButton />
          {user && <Avatar />}
          {!user && (
            <a href="#" onClick={handleLogin} role="button">
              <button className={cx('btn-login')} name="login">
                로그인
              </button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
