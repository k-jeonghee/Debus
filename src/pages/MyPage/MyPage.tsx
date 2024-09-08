import Button from '@components/@common/Button/Button';
import DeleteUser from '@components/@common/Modal/ModalContents/DeleteUser/DeleteUser';
import { userInfoQueryOptions } from '@hooks/services/queries/user';
import { useModal } from '@hooks/useModal';
import { authAtom } from '@store/atoms/auth';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteUserFromGoogle, updateUserInfo } from 'src/api/firebase';
import { useToast } from 'src/context/ToastContext';
import styles from './MyPage.module.css';
const cx = classnames.bind(styles);

type FormValue = {
  nickname: string;
  sns: string;
  options: string;
};

const MyPage = () => {
  const { id, name, email, photoURL } = useAtomValue(authAtom);
  const [isEdit, setIsEdit] = useState(false);
  const {
    data: { nickname, sns, options },
  } = useSuspenseQuery(userInfoQueryOptions(id));
  const optionsString = options && options.join(',');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    values: {
      nickname,
      sns,
      options: optionsString,
    },
  });

  const toast = useToast();
  const { openModal, ModalContainer } = useModal();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries(userInfoQueryOptions(id));
      toast.add({ type: 'success', message: '변경사항이 저장되었어요.' });
      setIsEdit(false);
    },
    onError: () => toast.add({ type: 'failure', message: '잠시 후 다시 시도해주세요.' }),
  });

  const handleEdit: SubmitHandler<FormValue> = (data) => {
    mutate({ userId: id, newInfo: { ...data, options: data.options.split(/[,.]/) } });
  };

  const handleDelete = async () => {
    const response = await openModal(DeleteUser);
    if (response.ok) {
      try {
        await deleteUserFromGoogle();
        toast.add({ type: 'success', message: '회원탈퇴가 완료되었어요🥲' });
      } catch (error) {
        toast.add({ type: 'failure', message: '회원탈퇴에 실패했어요. 잠시 후 다시 시도해주세요.' });
      }
    }
  };

  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        <h1>마이페이지</h1>
        {!isEdit && <Button text="수정" onClick={() => setIsEdit(true)} name="edit" />}
      </div>
      {/* demo에 필요 없는 속성 임시 제거 */}
      {/* <div className={cx('info')}>
        {photoURL ? <img src={photoURL} alt="profile" /> : <Bus width="36" height="36" fill="#656565" />}
        <div>
          <label htmlFor="name">익명</label>
          <p id="name">{name}</p>
          <label htmlFor="email">이메일</label>
          <p id="email">{email}</p>
        </div>
      </div> */}
      {/* {email && (
        <div className={cx('info')}>
          <img src={photoURL ? photoURL : ''} alt="" />
          <div>
            <label htmlFor="name">이름</label>
            <p id="name">{name}</p>
            <label htmlFor="email">이메일</label>
            <p id="email">{email}</p>
          </div>
        </div>
      )} */}
      <div className={cx('extra-info')}>
        <form onSubmit={handleSubmit(handleEdit)}>
          <label htmlFor="nickname">닉네임</label>
          {!isEdit ? <p>{nickname ? nickname : '-'}</p> : <input id="nickname" type="text" {...register('nickname')} />}
          <label htmlFor="options">
            정보
            <p className={cx('options-info')}>항목을 쉼표(,) 또는 점(.)으로 구분해주세요.</p>
          </label>
          {!isEdit ? (
            <p>{optionsString ? optionsString : '-'}</p>
          ) : (
            <input
              id="options"
              type="text"
              {...register('options', {
                validate: (value) => (value.includes(' ') ? '공백이 포함되어 있어요.' : true),
              })}
            />
          )}
          <p className={cx('error-msg')}>{errors.options?.message}</p>
          <label htmlFor="sns">SNS</label>
          {!isEdit ? (
            sns ? (
              <a href={sns} target="_blank" rel="noreferrer">
                🔗{sns}
              </a>
            ) : (
              <p>-</p>
            )
          ) : (
            <input id="sns" type="text" {...register('sns')} />
          )}
          {isEdit && (
            <div className={cx('btn-group')}>
              <Button text="취소" variant="default" onClick={() => setIsEdit(false)} name="cancel" />
              <Button text="저장" type="submit" variant="accent" name="save" />
            </div>
          )}
        </form>
      </div>
      <div className={cx('delete')}>
        <Button text="회원탈퇴" variant="accent" onClick={handleDelete} name="delete-account" />
      </div>
      <ModalContainer />
    </div>
  );
};

export default MyPage;
