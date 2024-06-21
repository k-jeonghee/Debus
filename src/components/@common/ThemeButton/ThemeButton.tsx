import { IoIosSunny } from '@react-icons/all-files/io/IoIosSunny';
import { IoMdMoon } from '@react-icons/all-files/io/IoMdMoon';
import { darkModeAtom } from '@store/atoms/theme';
import classnames from 'classnames/bind';
import { useAtom } from 'jotai';

import styles from './ThemeButton.module.css';
const cx = classnames.bind(styles);

const ThemeButton = () => {
  const [darkMode, toggleDarkMode] = useAtom(darkModeAtom);

  return (
    <>
      <button className={cx('wrapper')} onClick={toggleDarkMode}>
        {darkMode ? <IoMdMoon /> : <IoIosSunny />}
      </button>
    </>
  );
};

export default ThemeButton;
