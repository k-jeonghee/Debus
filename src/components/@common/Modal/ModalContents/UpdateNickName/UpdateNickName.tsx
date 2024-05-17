import Button from '@components/@common/Button/Button';
import ModalButtonGroup from '@components/@common/Modal/ModalTemplate/ModalButtonGroup';
import ModalContent from '@components/@common/Modal/ModalTemplate/ModalContent';
import ModalHeader from '@components/@common/Modal/ModalTemplate/ModalHeader';
import ModalTemplate from '@components/@common/Modal/ModalTemplate/ModalTemplate';
import classnames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { ModalContentProps } from 'src/@types/modal';
import styles from '../CreateChatRoom/Form/Form.module.css';
const cx = classnames.bind(styles);

type Name = { nickName: string };

const UpdateNickName = ({ onSubmit, onAbort }: ModalContentProps<Name>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Name>({ mode: 'onSubmit' });
  return (
    <ModalTemplate isOverlay={true}>
      <ModalHeader title={'닉네임 설정'} onClose={onAbort} />
      <ModalContent>
        <form className={cx('form-container')} onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="nickName">닉네임</label>
          <input
            type="text"
            id="nickName"
            {...register('nickName', {
              required: true,
              minLength: {
                value: 2,
                message: '2글자 이상 입력해주세요',
              },
            })}
            autoFocus
          />
          <p className={cx('error-msg')}>{errors.nickName?.message}</p>
          <ModalButtonGroup>
            <Button text="참여하기" variant="accent" type="submit" />
            <Button text="취소" variant="default" onClick={onAbort} />
          </ModalButtonGroup>
        </form>
      </ModalContent>
    </ModalTemplate>
  );
};

export default UpdateNickName;
