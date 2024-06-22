import Button from '@components/@common/Button/Button';
import ModalButtonGroup from '@components/@common/Modal/ModalTemplate/ModalButtonGroup';
import ModalContent from '@components/@common/Modal/ModalTemplate/ModalContent';
import ModalHeader from '@components/@common/Modal/ModalTemplate/ModalHeader';
import ModalTemplate from '@components/@common/Modal/ModalTemplate/ModalTemplate';
import classnames from 'classnames/bind';
import { ModalContentProps } from 'src/@types/modal';
import styles from './DeleteUser.module.css';
const cx = classnames.bind(styles);

export default function DeleteUser({ onSubmit, onAbort }: ModalContentProps) {
  return (
    <ModalTemplate isOverlay={true}>
      <ModalHeader title={'회원탈퇴'} onClose={onAbort} />
      <ModalContent>
        <p className={cx('content')}>
          탈퇴 후 기존 정보를 복구할 수 없어요. <br />
          정말 탈퇴하시겠어요? 🥲
        </p>
        <ModalButtonGroup>
          <Button text="취소" variant="default" onClick={onAbort} name="cancel" />
          <Button text="회원탈퇴" variant="accent" onClick={() => onSubmit('회원탈퇴 동의')} name="delete-account" />
        </ModalButtonGroup>
      </ModalContent>
    </ModalTemplate>
  );
}
