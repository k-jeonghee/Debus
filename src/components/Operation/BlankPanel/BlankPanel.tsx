import { GiStopSign } from '@react-icons/all-files/gi/GiStopSign';
import classnames from 'classnames/bind';

import styles from './BlankPanel.module.css';
const cx = classnames.bind(styles);

const BlankPanel = () => {
  return (
    <div className={cx('container')}>
      <div className={cx('content')}>
        <GiStopSign className={cx('icon')} />
        <h1>채팅방을 선택해주세요.</h1>
      </div>
    </div>
  );
};

export default BlankPanel;
