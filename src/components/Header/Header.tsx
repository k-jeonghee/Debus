import Avatar from '@components/@common/Avatar/Avatar';
import ThemeButton from '@components/@common/ThemeButton/ThemeButton';
import { baseAuthAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtom } from 'jotai';
import { Link, useNavigate } from 'react-router-dom';
import { login } from 'src/api/firebase';
import styles from './Header.module.css';
const cx = classnames.bind(styles);

const Header = () => {
  const [user, setUser] = useAtom(baseAuthAtom);
  const navigate = useNavigate();
  const handleLogin = () => {
    login().then((_user) => {
      navigate('/');
      if (_user) setUser(_user);
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
            <button className={cx('btn-login')} name="login" onClick={handleLogin}>
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
