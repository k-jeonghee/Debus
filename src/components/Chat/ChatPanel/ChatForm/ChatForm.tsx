import Textarea from '@components/@common/Textarea/Textarea';
import { useAddMessage } from '@hooks/services/mutations/chat';
import { authAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { ChangeEvent, KeyboardEventHandler, memo, useCallback, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BsPlusCircleFill } from 'react-icons/bs';
import { PiPaperPlaneTiltFill } from 'react-icons/pi';
import { PuffLoader } from 'react-spinners';
import { Message } from 'src/@types/chat';
import { uploadImage } from 'src/api/uploader';
import { useToast } from 'src/context/ToastContext';
import { assert } from 'src/utils/assert';
import styles from './ChatForm.module.css';
const cx = classnames.bind(styles);

export type FormData = {
  content: string;
};

type TextMessage = {
  content: string;
};

type FileMessage = {
  file: string;
};

type MessageData = TextMessage | FileMessage;

const ChatForm = ({ nickName, chatRoomId }: { nickName: string; chatRoomId: string }) => {
  const { id: uid } = useAtomValue(authAtom);
  const methods = useForm<FormData>();
  const { mutate } = useAddMessage(chatRoomId, {
    onError: () => toast.add({ type: 'failure', message: '메시지 전송 실패' }),
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  //메시지 객체 반환
  const createMessage = useCallback(
    (data: MessageData) => {
      const message: Omit<Message, 'id' | 'timestamp'> = {
        ...data,
        user: {
          id: uid,
          name: nickName,
        },
        chatRoomId,
      };

      return message;
    },
    [uid, nickName, chatRoomId],
  );

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
      mutate({ chatRoomId, message: createMessage({ file: downloadUrl }) });
    } catch (err) {
      toast.add({ type: 'failure', message: '이미지 업로드 실패' });
    } finally {
      setIsLoading(false);
    }
  };
  //<<<<<<<<<<<<<<<<<<<<<<<<<<파일 업로드

  //텍스트 메시지 전송
  const handleAddMessage: SubmitHandler<FormData> = useCallback(
    (data) => {
      const content = data.content;
      if (!content || content.trim() === '') return;

      mutate({ chatRoomId, message: createMessage({ content }) });
      methods.reset();
    },
    [chatRoomId, createMessage, methods, mutate],
  );

  const handleEnterSubmit: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      if (e.key !== 'Enter') return;
      if (e.shiftKey) return;
      if (!e.nativeEvent.isComposing) {
        e.preventDefault();
        methods.handleSubmit(handleAddMessage)();
      }
    },
    [methods, handleAddMessage],
  );

  return (
    <div className={cx('container')}>
      <div className={cx('inner-form-container')}>
        <form onSubmit={methods.handleSubmit(handleAddMessage)}>
          <Controller
            control={methods.control}
            name="content"
            defaultValue=""
            render={({ field }) => (
              <>
                <Textarea
                  {...field}
                  resize={true}
                  placeholder="내용을 입력해주세요"
                  className={'text-input'}
                  value={field.value}
                  onChange={field.onChange}
                  onKeyDown={handleEnterSubmit}
                />
                <div className={cx('btn-group')}>
                  <button className={cx('file-btn')} onClick={handleOpenFile} disabled={isLoading}>
                    {isLoading ? (
                      <PuffLoader color="#ff6636" loading size={24} />
                    ) : (
                      <BsPlusCircleFill className={cx({ disabled: isLoading })} />
                    )}
                  </button>
                  <button type="submit" className={cx('submit-btn', { active: field.value })} disabled={!field.value}>
                    <PiPaperPlaneTiltFill />
                  </button>
                </div>
              </>
            )}
          />
        </form>
      </div>
      <input type="file" accept="/image/*" ref={fileInputRef} onChange={handleChange} style={{ display: 'none' }} />
    </div>
  );
};

export default memo(ChatForm);
