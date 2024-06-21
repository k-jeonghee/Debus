import classnames from 'classnames/bind';
import { BeatLoader } from 'react-spinners';
import styles from './Loading.module.css';
const cx = classnames.bind(styles);

const Loading = () => {
  return (
    <div className={cx('wrapper')}>
      <BeatLoader color="#ff6636" size={20} />
    </div>
  );
};

export default Loading;
