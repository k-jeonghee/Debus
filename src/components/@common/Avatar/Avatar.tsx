import { Content, Item, Portal, Root, Trigger } from '@radix-ui/react-dropdown-menu';
import { baseAuthAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from 'src/api/firebase';
import Bus from 'src/assets/bus.svg?react';
import styles from './Avatar.module.css';
const cx = classnames.bind(styles);

const Avatar = () => {
  const user = useAtomValue(baseAuthAtom);
  const navigate = useNavigate();

  const handleLogOut = () => logout().then(() => navigate('/'));

  return (
    <>
      <Root>
        <Trigger asChild>
          <button className={cx('btn')}>
            <Bus width="20" height="20" fill="#ffa16e" />
          </button>
        </Trigger>
        <Portal>
          <Content className={cx('content')} onCloseAutoFocus={(e) => e.preventDefault()}>
            <Item className={cx('item')} asChild>
              {user && <Link to={'/my-operation'}>운행홈</Link>}
            </Item>
            <Item className={cx('item')} asChild>
              {user && <Link to={'/my-page'}>마이페이지</Link>}
            </Item>
            <Item className={cx('item')} asChild>
              <button role="button" onClick={handleLogOut} name="logout">
                로그아웃
              </button>
            </Item>
            <span className={cx('polygon')}>▲</span>
          </Content>
        </Portal>
      </Root>
    </>
  );
};

export default Avatar;
