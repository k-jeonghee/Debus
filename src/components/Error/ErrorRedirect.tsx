import Button from '@components/@common/Button/Button';
import classnames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import styles from './Error.module.css';
const cx = classnames.bind(styles);

type ErrorRedirectProps = {
  error: Error;
};

const ErrorRedirect = ({ error }: ErrorRedirectProps) => {
  const navigate = useNavigate();
  return (
    <div className={cx('container')}>
      <h1>{error?.message}</h1>
      <Button text="홈으로 이동" onClick={() => navigate('/')} variant="accent" name="redirect" />
    </div>
  );
};

export default ErrorRedirect;
