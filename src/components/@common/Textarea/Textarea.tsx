import classnames from 'classnames/bind';
import { ChangeEvent, TextareaHTMLAttributes, forwardRef, useCallback, useEffect, useState } from 'react';
import styles from './Textarea.module.css';
const cx = classnames.bind(styles);

type TextareaProps = CustomProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

type CustomProps = {
  resize?: boolean;
  height?: number;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ resize = false, height = 17, className, onChange, value, ...props }: TextareaProps, ref) => {
    const [textareaHeight, setTextareaHeight] = useState(height);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (resize) resizeTextareaHeight(e.target.value);
      if (onChange) onChange(e);
    };

    const resizeTextareaHeight = useCallback(
      (value: string) => {
        const lineHeight = height;
        const totalTextHeight = value.split('\n').length * lineHeight;
        const newHeight = totalTextHeight < lineHeight ? textareaHeight : totalTextHeight;
        setTextareaHeight(newHeight);
      },
      [height, textareaHeight],
    );

    useEffect(() => {
      if (!value) setTextareaHeight(height);
    }, [value, height]);

    return (
      <textarea
        ref={ref}
        className={cx(`${className}`)}
        style={{ height: textareaHeight }}
        value={value}
        onChange={onChange && handleChange}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
