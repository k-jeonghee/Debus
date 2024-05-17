import Textarea from '@components/@common/Textarea/Textarea';
import { useAddMessage } from '@hooks/services/mutations/chat';
import { authAtom } from '@store/atoms/auth';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { ChangeEvent, KeyboardEventHandler, memo, useCallback, useRef, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { BsPlusCircleFill } from 'react-icons/bs';
import { PiPaperPlaneTiltFill } from 'react-icons/pi';
import { PuffLoader } from 'react-spinners';
import { Message } from 'src/@types/chat';
import { uploadImage } from 'src/api/uploader';
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
  const { uid } = useAtomValue(authAtom);
  const methods = useForm<FormData>();
  const { mutate } = useAddMessage(chatRoomId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  //<<<<<<<<<<<<<<<<<<<<<<<<<<파일 업로드

  //텍스트 메시지 전송
  const handleAddMessage: SubmitHandler<FormData> = useCallback(
    (data) => {
      const content = data.content;
      if (!content || content.trim() === '') return;

      try {
        mutate({ chatRoomId, message: createMessage({ content }) });
      } catch (err) {
        console.log(err);
      }

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
        handleAddMessage({
          content: e.currentTarget.value,
        });
      }
    },
    [handleAddMessage],
  );

  return (
    <div className={cx('container')}>
      <div className={cx('inner-form-container')}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleAddMessage)}>
            <Textarea name="content" resize={true} onEnterSubmit={handleEnterSubmit} style={['text-input']} />
            <Controller
              control={methods.control}
              name="content"
              render={({ field: { value } }) => {
                return (
                  <div className={cx('btn-group')}>
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
                );
              }}
            />
          </form>
        </FormProvider>
      </div>
      <input type="file" accept="/image/*" ref={fileInputRef} onChange={handleChange} style={{ display: 'none' }} />
    </div>
  );
};

export default memo(ChatForm);
