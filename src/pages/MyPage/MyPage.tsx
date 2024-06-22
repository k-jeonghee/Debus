import Button from '@components/@common/Button/Button';
import DeleteUser from '@components/@common/Modal/ModalContents/DeleteUser/DeleteUser';
import { userInfoQueryOptions } from '@hooks/services/queries/user';
import { useModal } from '@hooks/useModal';
import { UserInfo, authAtom } from '@store/atoms/auth';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import classnames from 'classnames/bind';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteUserFromGoogle, updateUserInfo } from 'src/api/firebase';
import { useToast } from 'src/context/ToastContext';
import styles from './MyPage.module.css';
const cx = classnames.bind(styles);

const MyPage = () => {
  const { id, name, email, photoURL } = useAtomValue(authAtom);
  const [isEdit, setIsEdit] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm<UserInfo>();
  const {
    data: { nickname, sns, options },
  } = useSuspenseQuery(userInfoQueryOptions(id));
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

  /**
   * 정보 변경 직후 다시 수정 모드 진입 시 변경된 상태로 보여주기 위함
   */
  useEffect(() => {
    setValue('nickname', nickname);
    setValue('sns', sns);
    setValue('options', options);
  }, [setValue, nickname, sns, options]);

  const handleEdit: SubmitHandler<UserInfo> = (data) => {
    mutate({ userId: id, newInfo: { ...data } });
    reset();
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
      <div className={cx('info')}>
        <img src={photoURL ? photoURL : ''} alt="" />
        <div>
          <label htmlFor="name">이름</label>
          <p id="name">{name}</p>
          <label htmlFor="email">이메일</label>
          <p id="email">{email}</p>
        </div>
      </div>
      <div className={cx('extra-info')}>
        <form onSubmit={handleSubmit(handleEdit)}>
          <label htmlFor="nickname">닉네임</label>
          {!isEdit ? <p>{nickname ? nickname : '-'}</p> : <input id="nickname" type="text" {...register('nickname')} />}
          <label htmlFor="options">정보</label>
          {!isEdit ? (
            <p>{options ? (options as string[]).join(', ') : '-'}</p>
          ) : (
            <input id="options" type="text" {...register('options')} />
          )}
          <label htmlFor="sns">SNS</label>
          {!isEdit ? <p>{sns ? sns : '-'}</p> : <input id="sns" type="text" {...register('sns')} />}
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
