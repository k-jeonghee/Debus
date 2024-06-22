import classnames from 'classnames/bind';
import styles from './Button.module.css';
const cx = classnames.bind(styles);

type ButtonProps = {
  text: string;
  name: string;
  variant?: 'default' | 'accent' | 'confirm' | 'delete' | 'exit';
  onClick?: () => void | Promise<void>;
  type?: 'button' | 'submit';
};

const Button = ({ text, name, variant, onClick, type = 'button' }: ButtonProps) => {
  return (
    <button className={cx(`${variant}`)} onClick={onClick} type={type} name={name}>
      {text}
    </button>
  );
};

export default Button;
