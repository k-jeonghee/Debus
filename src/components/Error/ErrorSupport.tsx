import Button from '@components/@common/Button/Button';
import classnames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Error.module.css';
const cx = classnames.bind(styles);

const ErrorSupport = () => {
  return (
    <div className={cx('container')}>
      <h1>잠시 후 다시 시도해주세요. 🥲</h1>
      <Link to="/">
        <Button text="홈으로 이동" variant="accent" />
      </Link>
    </div>
  );
};

export default ErrorSupport;
