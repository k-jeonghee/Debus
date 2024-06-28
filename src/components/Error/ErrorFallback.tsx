import Button from '@components/@common/Button/Button';
import classnames from 'classnames/bind';
import styles from './Error.module.css';
const cx = classnames.bind(styles);

export type ErrorFallbackProps = {
  error: Error;
  onReset: () => void;
};

const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => {
  return (
    <div className={cx('container')}>
      <h1>{error?.message}</h1>
      <Button text="재시도" onClick={onReset} variant="accent" name="retry" />
    </div>
  );
};

export default ErrorFallback;
