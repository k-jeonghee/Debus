import Button from '@components/@common/Button/Button';
import classnames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Error.module.css';
const cx = classnames.bind(styles);

type ErrorRedirectProps = {
  error: Error;
};

const ErrorRedirect = ({ error }: ErrorRedirectProps) => {
  return (
    <div className={cx('container')}>
      <h1>{error?.message}</h1>
      <Link to="/">
        <Button text="홈으로 이동" variant="accent" />
      </Link>
    </div>
  );
};

export default ErrorRedirect;
