import classnames from 'classnames/bind';
import { ChangeEvent, KeyboardEventHandler, useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './Textarea.module.css';
const cx = classnames.bind(styles);

const Textarea = ({
  name,
  resize,
  onEnterSubmit,
  style,
}: {
  name: string;
  resize: boolean;
  onEnterSubmit: KeyboardEventHandler<HTMLTextAreaElement>;
  style?: string[];
}) => {
  const [textareaHeight, setTextareaHeight] = useState(17);
  const {
    register,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  //입력된 글자에 따라 teatarea height 조정
  const resizeTextareaHeight = useCallback(
    (value: string) => {
      const lineHeight = 17;
      const totalTextHeight = value.split('\n').length * lineHeight;
      const newHeight = totalTextHeight < lineHeight ? textareaHeight : totalTextHeight;
      setTextareaHeight(newHeight);
    },
    [textareaHeight],
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (resize) resizeTextareaHeight(e.target.value);
  };

  useEffect(() => {
    if (isSubmitSuccessful) setTextareaHeight(17);
  }, [isSubmitSuccessful]);

  return (
    <textarea
      className={cx(style && style)}
      style={{ height: textareaHeight }}
      rows={1}
      {...register(name, {
        onChange: handleChange,
      })}
      onKeyDown={onEnterSubmit}
      placeholder="내용을 입력해주세요"
      autoFocus
    />
  );
};

export default Textarea;
