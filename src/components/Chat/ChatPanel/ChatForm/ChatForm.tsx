import { useAddMessage } from '@hooks/services/mutations/chat';
import { authAtom } from '@store/atoms/auth';
import { currentChatRoom } from '@store/atoms/chat';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { ChangeEvent, KeyboardEventHandler, useCallback, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsPlusCircleFill } from 'react-icons/bs';
import { PiPaperPlaneTiltFill } from 'react-icons/pi';
import { PuffLoader } from 'react-spinners';
import { Message } from 'src/@types/chat';
import { uploadImage } from 'src/api/uploader';
import { assert } from 'src/utils/assert';
import styles from './ChatForm.module.css';
const cx = classnames.bind(styles);

type FormData = {
  content: string;
};

type TextMessage = {
  content: string;
};

type FileMessage = {
  file: string;
};

type MessageData = TextMessage | FileMessage;

const ChatForm = () => {
  const chatRoomId = useAtomValue(currentChatRoom);
  const user = useAtomValue(authAtom);
  const [textareaHeight, setTextareaHeight] = useState(17);
  const { register, handleSubmit, reset, watch, getValues } = useForm<FormData>();
  const value = watch('content');
  const { addMessage } = useAddMessage(chatRoomId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //메시지 객체 반환
  const createMessage = (data: MessageData) => {
    const message: Omit<Message, 'id' | 'timestamp'> = {
      ...data,
      user: {
        id: user.uid,
        name: user.displayName ?? 'noname',
      },
    };

    return message;
  };

  //>>>>>>>>>>>>>>>>>>>>>>>>>>파일 업로드
  const handleOpenFile = () => {
    assert(fileInputRef.current !== null, '파일 참조가 없습니다.');
    fileInputRef.current.click();
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const file = files && files[0];
    assert(file !== null, '업로드 된 파일이 없습니다.');
    setIsLoading(true);
    try {
      const downloadUrl = await uploadImage(chatRoomId, file);
      addMessage({ chatRoomId, message: createMessage({ file: downloadUrl }) });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  //<<<<<<<<<<<<<<<<<<<<<<<<<<파일 업로드

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

  //텍스트 메시지 전송
  const handleAddMessage: SubmitHandler<FormData> = (data) => {
    const content = data.content;

    if (!content || content.trim() === '') return;

    try {
      addMessage({ chatRoomId, message: createMessage({ content }) });
    } catch (err) {
      console.log(err);
    }

    setTextareaHeight(17);
    reset();
  };

  //Enter Submit
  const handleEnterSubmit: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key !== 'Enter') return;
    if (e.shiftKey) return;
    if (!e.nativeEvent.isComposing) {
      e.preventDefault();
      handleAddMessage({
        content: value,
      });
    }
  };

  return (
    <div className={cx('container')}>
      <div className={cx('inner-form-container')}>
        <form onSubmit={handleSubmit(handleAddMessage)}>
          <textarea
            className={cx('text-input')}
            style={{ height: textareaHeight + 'px' }}
            {...register('content', {
              onChange: () => resizeTextareaHeight(getValues('content')),
            })}
            rows={1}
            onKeyDown={handleEnterSubmit}
            placeholder="내용을 입력해주세요"
            autoFocus
          ></textarea>
          <div className={cx('footer')}>
            <button className={cx('file-btn')} onClick={handleOpenFile} disabled={isLoading}>
              {isLoading ? (
                <PuffLoader color="#ff6636" loading size={24} />
              ) : (
                <BsPlusCircleFill className={cx({ disabled: isLoading })} />
              )}
            </button>
            <button type="submit" className={cx('submit-btn', { active: value })} disabled={!value}>
              <PiPaperPlaneTiltFill />
            </button>
          </div>
        </form>
      </div>
      <input type="file" accept="/image/*" ref={fileInputRef} onChange={handleChange} style={{ display: 'none' }} />
    </div>
  );
};

export default ChatForm;
